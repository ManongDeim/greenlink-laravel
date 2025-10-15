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

        // Generate unique IDs
        $roomReserId = 'ROOM-' . strtoupper(Str::random(8));
        $reference = 'REF-' . strtoupper(Str::random(10));

        // Payment logic
        $paymentMethod = $request->input('payment_method'); // "Down Payment" or "Full Payment"
        $totalBill = (int) $request->input('total_bill');
        $payAmount = $paymentMethod === 'Down Payment' ? $totalBill * 0.5 : $totalBill;

        // Create Reservation in DB
        $reservation = RoomModel::create([
            'user_id' => $user->id,
            'room_reser_id' => $roomReserId,
            'reference_number' => $reference,
            'check_in_date' => $request->input('check_in_date'),
            'check_out_date' => $request->input('check_out_date'),
            'full_name' => $request->input('full_name'),
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone_number'),
            'pax' => $request->input('pax'),
            'room' => $request->input('room'),
            'total_bill' => $payAmount,
            'payment_method' => $paymentMethod,
            'payment_status' => 'Pending',
        ]);

        // ✅ Call PayMongo API
        $response = Http::withHeaders([
            'accept' => 'application/json',
            'authorization' => 'Basic ' . base64_encode(env('PAYMONGO_SECRET_KEY')),
            'content-type' => 'application/json',
        ])->post('https://api.paymongo.com/v1/checkout_sessions', [
            'data' => [
                'attributes' => [
                    'send_email_receipt' => false,
                    'show_description' => false,
                    'show_line_items' => true,
                    'cancel_url' => url('/paymentFailed?room_reser_id=' . $roomReserId),
                    'success_url' => url('/paymentSuccess?room_reser_id=' . $roomReserId),
                    'payment_method_types' => ['gcash', 'card'],
                    'line_items' => [[
                        'name' => $request->input('room'),
                        'quantity' => 1,
                        'currency' => 'PHP',
                        'amount' => (int) ($payAmount * 100),
                        'description' => 'Booking from ' . $request->input('check_in_date') . ' to ' . $request->input('check_out_date'),
                    ]],
                    'metadata' => [
                        'room_reser_id' => $roomReserId,
                        'reference_number' => $reference,
                        'payment_method' => $paymentMethod,
                        'user_id' => $user->id,
                    ],
                ],
            ],
        ]);

        $checkoutData = $response->json();

        if (isset($checkoutData['data']['attributes']['checkout_url'])) {
            return response()->json(['url' => $checkoutData['data']['attributes']['checkout_url']]);
        } else {
            return response()->json(['error' => 'Failed to create PayMongo checkout link'], 500);
        }
    }

    // ✅ Handle successful payment
    public function paymentSuccess(Request $request)
    {
        $roomReserId = $request->query('room_reser_id');
        RoomModel::where('room_reser_id', $roomReserId)
            ->update(['payment_status' => 'Paid']);

        return redirect('/pages/payment_success.html');
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
