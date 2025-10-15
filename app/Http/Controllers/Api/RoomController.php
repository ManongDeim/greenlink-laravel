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
    try {
        // Validate incoming data
        $validated = $request->validate([
            'room' => 'required|string',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date',
            'full_name' => 'required|string',
            'email' => 'required|email',
            'phone_number' => 'required|string',
            'pax' => 'required|integer',
            'total_bill' => 'required|numeric',
            'payment_method' => 'required|string',
        ]);

        // Generate unique reservation ID
        $roomReserId = 'ROOM-' . strtoupper(Str::random(10));

        // Create a pending reservation first
        $reservation = RoomModel::create([
            'user_id' => optional(Auth::user())->id,

            'room_reser_id' => $roomReserId,
            'room' => $validated['room'],
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'pax' => $validated['pax'],
            'total_bill' => $validated['total_bill'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'Pending',
        ]);

        // Create checkout session
        $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'),  '')
            ->post('https://api.paymongo.com/v1/checkout_sessions', [
                'data' => [
                    'attributes' => [
                        'send_email_receipt' => false,
                        'show_description' => true,
                        'description' => "Room Reservation: {$validated['room']} ({$roomReserId})",
                        'line_items' => [[
                            'name' => $validated['room'],
                            'amount' => (int)($validated['total_bill'] * 100), // PayMongo expects centavos
                            'currency' => 'PHP',
                            'quantity' => 1,
                        ]],
                        'success_url' => url("/payment/success/{$roomReserId}"),
                        'cancel_url' => url("/payment/failed/{$roomReserId}"),
                    ],
                ],
            ]);

        $result = $response->json();

        if ($response->failed() || empty($result['data']['attributes']['checkout_url'])) {
            Log::error('PayMongo error response:', ['response' => $result]);
            return response()->json(['error' => 'Failed to create PayMongo checkout link'], 500);
        }

        $checkoutUrl = $result['data']['attributes']['checkout_url'];

        return response()->json([
            'checkout_url' => $checkoutUrl,
            'reservation_id' => $roomReserId,
        ]);
    } catch (\Exception $e) {
        Log::error('Payment creation failed:', ['message' => $e->getMessage()]);
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    // ✅ Handle successful payment
    public function paymentSuccess(Request $request)
    {
        $roomReserId = $request->query('room_reser_id');
        RoomModel::where('room_reser_id', $roomReserId)
            ->update(['payment_status' => 'Paid']);

        return redirect('/pages/paymentsuccess.html');
    }

    // ✅ Handle failed payment
    public function paymentFailed(Request $request)
    {
        $roomReserId = $request->query('room_reser_id');
        RoomModel::where('room_reser_id', $roomReserId)
            ->update(['payment_status' => 'Failed']);

        return redirect('/pages/payment_failed.html');
    }
}
