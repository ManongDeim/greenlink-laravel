<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\RoomModel;

class PaymongoWebhookController extends Controller
{
    // PayMongo will POST events here. Minimal verification; log everything.
    public function handle(Request $request)
    {
        $payload = $request->all();
        Log::info('PayMongo webhook received', $payload);

        // Typical structure: $payload['data']['attributes']['type'] etc.
        $type = $payload['data']['type'] ?? ($payload['type'] ?? null);
        $attributes = $payload['data']['attributes'] ?? ($payload['attributes'] ?? []);

        // When checkout_sessions.completed or payment.paid (depending on PayMongo), map to reservation
        // Try to get checkout_session id and payment_intent/payment id
        $sessionId = $payload['data']['id'] ?? null;
        $objectType = $attributes['type'] ?? ($attributes['object'] ?? null);

        // Try several common paths
        $checkout = $attributes['checkout_session'] ?? null;
        $paymentIntentId = null;
        $paymentId = null;

        // If the event contains payment information:
        if (isset($attributes['payment_intent'])) {
            $paymentIntentId = $attributes['payment_intent'];
        }

        // Some events include 'data.attributes.metadata' or 'data.attributes.client_key'
        $clientKey = $attributes['client_key'] ?? null;

        // Attempt: if session id present, find reservation by paymongo_session_id
        if ($sessionId) {
            $reservation = RoomModel::where('paymongo_session_id', $sessionId)->first();
            if ($reservation) {
                // If payment info exists, save it
                if (isset($attributes['payment'])) {
                    // attributes.payment might contain id
                    $payment = $attributes['payment'];
                    $paymentId = is_array($payment) ? ($payment['id'] ?? null) : $payment;
                }
                // If payment_intent found
                if ($paymentIntentId || $paymentId) {
                    $reservation->paymongo_payment_id = $paymentIntentId ?? $paymentId;
                    $reservation->payment_status = 'Paid';
                    $reservation->save();
                    Log::info('Reservation updated from webhook', ['reservation' => $reservation->room_reser_id, 'payment' => $reservation->paymongo_payment_id]);
                }
            } else {
                Log::info('No reservation found for paymongo_session_id', ['session_id' => $sessionId]);
            }
        }

        // Some PayMongo events include nested "payment" objects in different structure:
        // Try to extract payment id from payload anywhere (simple scan)
        if (!$paymentId) {
            $paymentId = data_get($payload, 'data.attributes.payment.id') ?? data_get($payload, 'data.attributes.object.id') ?? null;
        }

        // If we have a payment id and no mapping yet, try to match by amount and user email (best-effort)
        if ($paymentId && empty($reservation)) {
            Log::info('Payment id present but no direct session mapping; skipping for now', ['payment' => $paymentId]);
        }

        return response()->json(['received' => true]);
    }
}
