<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class RoomController extends Controller
{
    // 1️⃣ Create PayMongo payment link
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
        $finalTotal = $validated['total_bill'];

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

    // 2️⃣ Payment success handled on redirect
    public function paymentSuccess(Request $request)
{
    $ref = $request->query('ref');
    Log::info('Payment redirect hit', ['ref' => $ref, 'full_url' => $request->fullUrl()]);

    $reservation = RoomModel::where('ref_number', $ref)->first();
    if (!$reservation) {
        Log::warning("Reservation not found for ref: {$ref}");
        return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');
    }

    // Mark as Paid on redirect (best-effort)
    $statusMap = ['Down Payment' => 'Down Paid', 'Full Payment' => 'Paid'];
    $paymentStatus = $statusMap[$reservation->payment_method] ?? 'Paid';
    $reservation->update(['payment_status' => $paymentStatus]);

    Log::info('Reservation marked payment status (redirect)', [
        'reservation' => $reservation->room_reser_id,
        'payment_status' => $paymentStatus
    ]);

    // ------------------------------
    //  SEND EMAILS USING HOSTINGER SMTP
    // ------------------------------
    try {
        // Admin emails
        $adminEmails = ["deimdgreat@gmail.com", "x3qe2w1@gmail.com"];
        $subjectAdmin = "New Reservation Paid: {$reservation->room_reser_id}";

        $adminMessage = "A customer has successfully paid for a reservation.\n\n" .
                        "Reservation ID: {$reservation->room_reser_id}\n" .
                        "Name: {$reservation->full_name}\n" .
                        "Room: {$reservation->room}\n" .
                        "Total Paid: PHP {$reservation->total_bill}\n" .
                        "Email: {$reservation->email}\n" .
                        "Phone: {$reservation->phone_number}\n";

        foreach ($adminEmails as $email) {
            Mail::raw($adminMessage, function ($message) use ($email, $subjectAdmin) {
                $message->to($email)
                        ->subject($subjectAdmin);
            });
        }

        Log::info("📧 Admin emails sent via Hostinger SMTP", ["to" => $adminEmails]);

        // Customer email
        $customerMessage = "Hello {$reservation->full_name},\n\n" .
                           "Your payment for the room '{$reservation->room}' has been successfully received.\n" .
                           "Reservation ID: {$reservation->room_reser_id}\n" .
                           "Total Paid: PHP {$reservation->total_bill}\n\n" .
                           "Thank you for choosing us!";

        Mail::raw($customerMessage, function ($message) use ($reservation) {
            $message->to($reservation->email)
                    ->subject("Payment Completed for Reservation {$reservation->room_reser_id}");
        });

        Log::info("📧 User email sent via Hostinger SMTP", ["to" => $reservation->email]);

    } catch (\Exception $e) {
        Log::error("❌ Failed to send email via Hostinger SMTP: " . $e->getMessage());
    }

    return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentSuccess.html');
}

    // 3️⃣ Payment failed redirect
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

    // 4️⃣ List all reservations
    public function index()
    {
        return response()->json(RoomModel::all());
    }

    // 5️⃣ Get booked date ranges
    public function getBookedDates()
    {
        $roomId = request()->query('room_id');

        $query = RoomModel::select('check_in_date', 'check_out_date')
            ->where('payment_status', 'Paid');

        if ($roomId) $query->where('room_id', $roomId);

        $reservations = $query->get();

        $bookedRanges = $reservations->map(function ($r) {
            return ['from' => $r->check_in_date, 'to' => $r->check_out_date];
        });

        return response()->json($bookedRanges);
    }

    // 6️⃣ Update reservation status manually
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
