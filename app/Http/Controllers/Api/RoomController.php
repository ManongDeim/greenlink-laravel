<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use App\Models\GoogleUser;

class RoomController extends Controller
{
  public function createPaymentLink(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'room_id' => 'nullable|integer|exists:rooms,id',
            'room' => 'required|string',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
            'full_name' => 'required|string',
            'email' => 'required|email',
            'phone_number' => 'required|string',
            'pax' => 'required|integer|min:1',
            'total_bill' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:Down Payment,Full Payment'
        ]);

        $roomReserId = 'ROOM-' . strtoupper(uniqid());
        $refNumber = uniqid('REF-');
        $finalTotal = $validated['total_bill']; // Add discount logic here if needed

        $reservation = RoomModel::create([
            'room_id' => $validated['room_id'] ?? null,
            'room_reser_id' => $roomReserId,
            'user_id' => $user->id,
            'room' => $validated['room'],
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'pax' => $validated['pax'],
            'total_bill' => $finalTotal,
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'Pending',
            'ref_number' => $refNumber,
            'status' => 'Pending'
        ]);

        try {
            $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
                ->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'line_items' => [[
                                'name' => $validated['room'],
                                'amount' => (int)($finalTotal * 100),
                                'currency' => 'PHP',
                                'quantity' => 1
                            ]],
                            'payment_method_types' => ['gcash', 'card'],
                            'amount' => (int)($finalTotal * 100),
                            'currency' => 'PHP',
                            'description' => "Room Reservation: {$validated['room']} ({$roomReserId})",
                            'success_url' => url("/api/room/paymentSuccess?ref={$refNumber}"),
                            'cancel_url' => url("/api/room/paymentFailed?ref={$refNumber}"),
                        ]
                    ]
                ]);

            $respJson = $response->json();
            $sessionId = $respJson['data']['id'] ?? null;

            if ($sessionId) {
                $reservation->paymongo_session_id = $sessionId;
                $reservation->save();
            }

            return response()->json([
                'payment_url' => $respJson['data']['attributes']['checkout_url'] ?? null,
                'roomReser_id' => $roomReserId,
                'ref_number' => $refNumber
            ]);

        } catch (\Exception $e) {
            Log::error('PayMongo session error', ['err' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create payment session'], 500);
        }
    }

    // 2️⃣ Webhook to handle payment confirmation
  public function paymongoWebhook(Request $request)
{
$payload = $request->all();
Log::info('PayMongo Webhook Received', $payload);


$eventType = $payload['data']['attributes']['type'] ?? null;
$reservation = null;
$paymentId = null;
$sessionId = null;

if ($eventType === 'checkout_session.payment.paid') {
    $sessionData = $payload['data']['attributes']['data']['attributes'] ?? [];
    $sessionId = $sessionData['id'] ?? null;

    $payments = $sessionData['payments'] ?? [];
    $paymentId = $payments[0]['attributes']['id'] ?? null; // ✅ use attributes

    if ($sessionId) {
        $reservation = RoomModel::where('paymongo_session_id', $sessionId)->first();
    }

    // fallback: parse description
    if (!$reservation && !empty($payments)) {
        $description = $payments[0]['attributes']['description'] ?? '';
        if ($description) {
            preg_match('/ROOM-[A-Z0-9]+/', $description, $matches);
            if (!empty($matches)) {
                $roomReserId = $matches[0];
                $reservation = RoomModel::where('room_reser_id', $roomReserId)->first();
            }
        }
    }

} elseif ($eventType === 'payment.paid') {
    $paymentData = $payload['data']['attributes']['data']['attributes'] ?? [];
    $paymentId = $paymentData['id'] ?? null; // sometimes this is already correct
    $description = $paymentData['description'] ?? '';

    if ($description) {
        preg_match('/ROOM-[A-Z0-9]+/', $description, $matches);
        if (!empty($matches)) {
            $roomReserId = $matches[0];
            $reservation = RoomModel::where('room_reser_id', $roomReserId)->first();
        }
    }
}

if ($reservation && $paymentId) {
    $reservation->paymongo_payment_id = $paymentId;
    $reservation->payment_status = 'Paid';
    $reservation->save();

    Log::info("Reservation updated via webhook", [
        'reservation_id' => $reservation->room_reser_id,
        'paymongo_session_id' => $reservation->paymongo_session_id,
        'paymongo_payment_id' => $reservation->paymongo_payment_id
    ]);
} else {
    Log::warning('Reservation or payment_id missing for webhook event', [
        'eventType' => $eventType,
        'paymentId' => $paymentId,
        'sessionId' => $sessionId
    ]);
}

return response()->json(['status' => 'success']);


}

    // Payment redirect will still mark Paid for UX, but authoritative payment mapping happens in webhook
    public function paymentSuccess(Request $request)
    {
        $ref = $request->query('ref');
        Log::info('Payment redirect hit', ['ref' => $ref, 'full_url' => $request->fullUrl()]);

        $reservation = RoomModel::where('ref_number', $ref)->first();
        if (!$reservation) {
            Log::warning("Reservation not found for ref: {$ref}");
            return redirect('/pages/paymentFailed.html');
        }

        // Mark as Paid on redirect (best-effort) — proper payment id is set by webhook
        $statusMap = ['Down Payment' => 'Down Paid', 'Full Payment' => 'Paid'];
        $paymentStatus = $statusMap[$reservation->payment_method] ?? 'Paid';
        $reservation->update(['payment_status' => $paymentStatus]);

        Log::info('Reservation marked payment status (redirect)', ['reservation' => $reservation->room_reser_id, 'payment_status' => $paymentStatus]);

        return redirect('/pages/paymentSuccess.html');
    }

    public function paymentFailed(Request $request)
    {
        $ref = $request->query('ref');
        Log::info('Payment failed redirect', ['ref' => $ref]);
        $reservation = RoomModel::where('ref_number', $ref)->first();
        if ($reservation) {
            $reservation->update(['payment_status' => 'Failed']);
        }
        return redirect('/pages/paymentFailed.html');
    }

    public function index()
    {
        return response()->json(RoomModel::all());
    }

      public function getBookedDates()
    {
        $roomId = request()->query('room_id');

    // ✅ Use the reservations table, not RoomModel
    $query = RoomModel::select('check_in_date', 'check_out_date')
        ->where('payment_status', 'Paid'); // only include Paid

    if ($roomId) {
        $query->where('room_id', $roomId);
    }

    $reservations = $query->get();

    // ✅ Format data for Flatpickr
    $bookedRanges = $reservations->map(function ($r) {
        return [
            'from' => $r->check_in_date,
            'to' => $r->check_out_date,
        ];
    });

    return response()->json($bookedRanges);
    }

    public function updateStatus($id, Request $request)
{
    $reservation = RoomModel::where('room_reser_id', $id)->first();

    if (!$reservation) {
        return response()->json(['message' => 'Reservation not found'], 404);
    }

    $reservation->status = $request->status;
    $reservation->save();

    return response()->json(['message' => 'Status updated successfully']);
}


}