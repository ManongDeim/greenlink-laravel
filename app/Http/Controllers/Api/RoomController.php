<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class RoomController extends Controller
{
public function createPaymentLink(Request $request)
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'room' => 'required|string',
        'check_in_date' => 'required|date',
        'check_out_date' => 'required|date|after_or_equal:check_in_date',
        'full_name' => 'required|string',
        'email' => 'required|email',
        'phone_number' => 'required|string',
        'pax' => 'required|integer|min:1',
        'total_bill' => 'required|numeric|min:1',
        'payment_type' => 'required|string|in:down,full'
    ]);

    $roomReserId = 'ROOM-' . strtoupper(uniqid());
    $refNumber = uniqid('REF-');

    // Determine final amount based on payment type
    $finalTotal = $validated['payment_type'] === 'down'
        ? $validated['total_bill'] * 0.5
        : $validated['total_bill'];

    // Save initial booking
    $reservation = RoomModel::create([
        'room_reser_id' => $roomReserId,
        'user_id' => $user->id,
        'room_name' => $validated['room'],
        'check_in' => $validated['check_in_date'],
        'check_out' => $validated['check_out_date'],
        'full_name' => $validated['full_name'],
        'email' => $validated['email'],
        'phone_number' => $validated['phone_number'],
        'pax' => $validated['pax'],
        'total_bill' => $finalTotal,
        'payment_method' => $validated['payment_type'] === 'down' ? 'Down Payment' : 'Full Payment',
        'payment_status' => 'Pending',
        'ref_number' => $refNumber
    ]);

    // PayMongo session
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
                    'payment_method_types' => ['gcash'], // or ['card']
                    'amount' => (int)($finalTotal * 100),
                    'description' => "Room Reservation: {$validated['room']} ({$roomReserId})",
                    'remarks' => $refNumber,
                    'currency' => 'PHP',
                    'show_line_items' => true,
                    'show_description' => true,
                    'success_url' => url("/api/room-payment-success?ref={$refNumber}"),
                    'cancel_url' => url("/api/room-payment-failed?ref={$refNumber}"),
                ]
            ]
        ]);

        Log::info('PayMongo response', $response->json());

    $checkoutUrl = $response->json()['data']['attributes']['checkout_url'] ?? null;

    return response()->json([
        'payment_url' => $checkoutUrl,
        'roomReser_id' => $roomReserId,
        'ref_number' => $refNumber
    ]);
}


    // ✅ Handle successful payment
    public function paymentSuccess(Request $request)
    {
        
    $ref = $request->query('ref');
    $reservation = RoomModel::where('ref_number', $ref)->first();
    if (!$reservation) return redirect('/pages/paymentFailed.html');

    $reservation->update(['payment_status' => 'Paid']);
    return redirect('/pages/paymentSuccess.html');
    }

    // ✅ Handle failed payment
    public function paymentFailed(Request $request)
    {
       $ref = $request->query('ref');
    $reservation = RoomModel::where('ref_number', $ref)->first();
    if ($reservation) {
        $reservation->update([
            'payment_status' => 'Failed',
            'order_status' => 'Cancelled'
        ]);
    }
    return redirect('/pages/paymentFailed.html');
    }
}
