<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\GlobalMailHelper;
use App\Models\RoomModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use App\Models\GoogleUser;
use Illuminate\Support\Facades\Mail;


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

    Log::info("🔥 PayMongo Webhook Hit", ["raw" => $payload]);

    $eventType = $payload['data']['attributes']['type'] ?? null;
    Log::info("📌 Event Type Detected", ["type" => $eventType]);

    $reservation = null;
    $paymentId = null;
    $sessionId = null;

    // ==========================================
    // ✅ MAIN EVENT: checkout_session.payment.paid
    // ==========================================
    if ($eventType === 'checkout_session.payment.paid') {

        Log::info("➡ Processing checkout_session.payment.paid event");

        $sessionData = $payload['data']['attributes']['data'] ?? [];
        $sessionId = $sessionData['id'] ?? null;

        // Extract payments array (might be truncated)
        $payments = $sessionData['payments'] ?? [];
        $paymentId = $payments[0]['id'] ?? null;

        Log::info("📌 Checkout Session Data Extracted", [
            "sessionId" => $sessionId,
            "paymentId" => $paymentId
        ]);

        // ==========================================
        // 🔥 FALLBACK #1 --> payment_intent.attributes.payments
        // ==========================================
        if (!$paymentId) {
            $piPayments = $sessionData['payment_intent']['attributes']['payments'] ?? null;

            if ($piPayments) {
                // Case: string format ["pay_xxx"]
                if (is_string($piPayments[0] ?? null)) {
                    $paymentId = $piPayments[0];
                }

                // Case: object format [{"id": "pay_xxx"}]
                if (isset($piPayments[0]['id'])) {
                    $paymentId = $piPayments[0]['id'];
                }

                Log::info("🔍 Fallback PaymentIntent Payment ID Check", [
                    "piPayments_raw" => $piPayments,
                    "paymentId" => $paymentId
                ]);
            }
        }

        // ==========================================
        // 🔥 Lookup Reservation using session ID
        // ==========================================
        if ($sessionId) {
            $reservation = RoomModel::where('paymongo_session_id', $sessionId)->first();
            Log::info("🔍 Reservation Lookup by sessionId", ["found" => $reservation ? true : false]);
        }

        // ==========================================
        // 🔥 FINAL FALLBACK: extract ROOM-XXXXX from description
        // ==========================================
        if (!$reservation && !empty($payments)) {
            $description = $payments[0]['attributes']['description'] ?? null;

            if ($description) {
                preg_match('/ROOM-[A-Z0-9]+/', $description, $matches);

                if (!empty($matches)) {
                    $roomReserId = $matches[0];
                    $reservation = RoomModel::where('room_reser_id', $roomReserId)->first();

                    Log::info("🔍 Fallback Reservation Lookup via Description", [
                        "description" => $description,
                        "roomReserId" => $roomReserId,
                        "found" => $reservation ? true : false
                    ]);
                }
            }
        }
    }

    // Fallback event type: payment.paid (not usually used)
    elseif ($eventType === 'payment.paid') {
        $paymentData = $payload['data']['attributes']['data']['attributes'] ?? [];
        $paymentId = $paymentData['id'] ?? null;
        $description = $paymentData['description'] ?? '';

        if ($description) {
            preg_match('/ROOM-[A-Z0-9]+/', $description, $matches);

            if (!empty($matches)) {
                $roomReserId = $matches[0];
                $reservation = RoomModel::where('room_reser_id', $roomReserId)->first();
            }
        }
    }

    // ==========================================
    // 🚨 IF STILL MISSING → LOG ISSUE
    // ==========================================
    if (!$reservation || !$paymentId) {
        Log::warning("⚠ Missing reservation or payment ID", [
            "eventType" => $eventType,
            "paymentId" => $paymentId,
            "sessionId" => $sessionId
        ]);

        return response()->json(['status' => 'ignored']);
    }

    // ==========================================
    // ✅ UPDATE RESERVATION STATUS
    // ==========================================
    $reservation->paymongo_payment_id = $paymentId;
    $reservation->payment_status = 'Paid';
    $reservation->save();

    Log::info("✅ Reservation updated via webhook", [
        'reservation_id' => $reservation->room_reser_id,
        'paymongo_session_id' => $reservation->paymongo_session_id,
        'paymongo_payment_id' => $reservation->paymongo_payment_id
    ]);

    // ==========================================
    // ✉ EMAIL NOTIFICATIONS
    // ==========================================

    $mailHelper = new GlobalMailHelper();

    // User email
    $mailHelper->sendMail(
        $reservation->email,
        "Payment Completed for Reservation {$reservation->room_reser_id}",
        "
            <p>Hello {$reservation->full_name},</p>
            <p>Your payment for <strong>{$reservation->room}</strong> has been successfully received.</p>
            <p>Reservation ID: {$reservation->room_reser_id}</p>
            <p>Total Paid: PHP {$reservation->total_bill}</p>
            <p>Thank you for choosing us!</p>
        "
    );

    Log::info("📧 User email sent", ["to" => $reservation->email]);

    // Admin email
    $adminEmails = ["deimdgreat@gmail.com", "x3qe2w1@gmail.com"];

    $mailHelper->sendMail(
        $adminEmails,
        "New Reservation Paid: {$reservation->room_reser_id}",
        "
            <p>New reservation payment received:</p>
            <ul>
                <li>Reservation ID: {$reservation->room_reser_id}</li>
                <li>Name: {$reservation->full_name}</li>
                <li>Room: {$reservation->room}</li>
                <li>Total Paid: PHP {$reservation->total_bill}</li>
                <li>Email: {$reservation->email}</li>
                <li>Phone: {$reservation->phone_number}</li>
            </ul>
        "
    );

    Log::info("📧 Admin email sent", ["to" => $adminEmails]);

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

    // Mark as Paid on redirect (best-effort)
    $statusMap = ['Down Payment' => 'Down Paid', 'Full Payment' => 'Paid'];
    $paymentStatus = $statusMap[$reservation->payment_method] ?? 'Paid';
    $reservation->update(['payment_status' => $paymentStatus]);

    Log::info('Reservation marked payment status (redirect)', [
        'reservation' => $reservation->room_reser_id,
        'payment_status' => $paymentStatus
    ]);

    // -------------------------------
    // ✉ EMAIL USING HOSTINGER SMTP
    // -------------------------------
    try {
        // Send to customer
        Mail::send([], [], function ($message) use ($reservation) {
            $message->to($reservation->email)
                    ->subject("Payment Completed for Reservation {$reservation->room_reser_id}")
                    ->setBody("
                        <p>Hello {$reservation->full_name},</p>
                        <p>Your payment for <strong>{$reservation->room}</strong> has been successfully received.</p>
                        <p>Reservation ID: {$reservation->room_reser_id}</p>
                        <p>Total Paid: PHP {$reservation->total_bill}</p>
                        <p>Thank you for choosing us!</p>
                    ", 'text/html');
        });

        Log::info("📧 User email sent via Hostinger SMTP", ["to" => $reservation->email]);

        // Send to admins
        $adminEmails = ["deimdgreat@gmail.com", "x3qe2w1@gmail.com"];
        foreach ($adminEmails as $adminEmail) {
            Mail::send([], [], function ($message) use ($reservation, $adminEmail) {
                $message->to($adminEmail)
                        ->subject("New Reservation Paid: {$reservation->room_reser_id}")
                        ->setBody("
                            <p>New reservation payment received:</p>
                            <ul>
                                <li>Reservation ID: {$reservation->room_reser_id}</li>
                                <li>Name: {$reservation->full_name}</li>
                                <li>Room: {$reservation->room}</li>
                                <li>Total Paid: PHP {$reservation->total_bill}</li>
                                <li>Email: {$reservation->email}</li>
                                <li>Phone: {$reservation->phone_number}</li>
                            </ul>
                        ", 'text/html');
            });
        }

        Log::info("📧 Admin emails sent via Hostinger SMTP", ["to" => $adminEmails]);

    } catch (\Exception $e) {
        Log::error("❌ Failed to send email via Hostinger SMTP: " . $e->getMessage());
    }

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