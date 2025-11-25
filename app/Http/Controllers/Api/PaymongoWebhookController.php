<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\RoomModel;

class PayMongoWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        Log::info('💳 PayMongo Webhook received', $payload);

        $eventType = $payload['type'] ?? null;
        $data = $payload['data']['attributes'] ?? [];

        if (!$eventType || !$data) {
            Log::warning('Webhook payload missing type or data');
            return response()->json(['status' => 'ignored'], 200);
        }

        // Only handle successful payments
        if ($eventType === 'payment.paid' || $eventType === 'checkout.session.paid') {
            $checkoutSessionId = $data['checkout_session_id'] ?? null;
            $paymentIntentId = $data['payment_intent'] ?? null;
            $amount = $data['amount'] ?? 0;

            // Find reservation by checkout_session_id
            $reservation = RoomModel::where('checkout_session_id', $checkoutSessionId)->first();
            if (!$reservation) {
                Log::warning("Reservation not found for session: {$checkoutSessionId}");
                return response()->json(['status' => 'ignored'], 200);
            }

            // Update reservation
            $reservation->payment_status = 'Paid';
            $reservation->paymongo_payment_id = $paymentIntentId;
            $reservation->save();

            Log::info("Reservation updated as Paid: {$reservation->room_reser_id}");
        }

        return response()->json(['status' => 'success'], 200);
    }
}
