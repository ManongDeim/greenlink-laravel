<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FoodOrderModel;
use App\Models\FarmOrderModel;
use App\Models\RoomModel;
use App\Models\EventModel;

class CustomerDashboardController extends Controller
{
    public function getFoodOrders(Request $request) {
        $user = $request->user();
        $orders = FoodOrderModel::where('user_id', $user->id)->orderBy('id', 'desc')->get();
        return response()->json($orders);
    }

    public function getFarmOrders(Request $request) {
        $user = $request->user();
        $orders = FarmOrderModel::where('user_id', $user->id)->orderBy('id', 'desc')->get();
        return response()->json($orders);
    }

    public function getRoomReservations(Request $request) {
        $user = $request->user();
        $reservations = RoomModel::where('user_id', $user->id)->orderBy('id', 'desc')->get();
        return response()->json($reservations);
    }

    public function getEventReservations(Request $request) {
        $user = $request->user();
        $reservations = EventModel::where('user_id', $user->id)->orderBy('id', 'desc')->get();
        return response()->json($reservations);
    }

    public function cancelFoodOrder($id)
    {
        $order = FoodOrderModel::where('foodOrder_id', $id)->first();
        if (!$order) return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        $order->order_status = 'Cancelled';
        $order->save();
        return response()->json(['success' => true, 'message' => 'Food order cancelled']);
    }

    public function cancelFarmOrder($id)
    {
        $order = FarmOrderModel::where('farmOrder_id', $id)->first();
        if (!$order) return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        $order->order_status = 'Cancelled';
        $order->save();
        return response()->json(['success' => true, 'message' => 'Farm order cancelled']);
    }

    public function cancelRoomReservation($id)
    {
        $reservation = RoomModel::where('room_reser_id', $id)->first();
        if (!$reservation) {
            return response()->json(['success' => false, 'message' => 'Reservation not found'], 404);
        }

        $checkIn = Carbon::parse($reservation->check_in_date)->startOfDay();
        $now = Carbon::now();

        // hours difference (positive if in future)
        $hoursDiff = $now->floatDiffInHours($checkIn, false);

        Log::info('📌 Cancel request received', [
            'reservation_id' => $reservation->room_reser_id,
            'payment_status' => $reservation->payment_status,
            'payment_method' => $reservation->payment_method,
            'paymongo_payment_id' => $reservation->paymongo_payment_id,
            'check_in' => $reservation->check_in_date
        ]);

        Log::info('⏱ Hours until check-in', ['reservation_id' => $reservation->room_reser_id, 'hours_diff' => $hoursDiff]);

        if ($hoursDiff >= 24) {
            // Fully refundable
            $reservation->status = 'Cancelled';
            $reservation->save();

            Log::info('🔄 Eligible for FULL REFUND', ['reservation_id' => $reservation->room_reser_id]);

            // If fully paid and we have a PayMongo payment id, attempt refund
            if ($reservation->payment_status === 'Paid' && $reservation->payment_method === 'Full Payment' && $reservation->paymongo_payment_id) {
                $refundSuccess = $this->refundPayMongoPayment($reservation->paymongo_payment_id, $reservation->total_bill, $reservation->room_reser_id);
                Log::info("💳 Refund status for reservation {$reservation->room_reser_id}: " . ($refundSuccess ? 'SUCCESS' : 'FAILED'));
            } else {
                Log::warning('⚠️ Refund NOT triggered — condition failed', [
                    'reservation_id' => $reservation->room_reser_id,
                    'payment_status' => $reservation->payment_status,
                    'payment_method' => $reservation->payment_method,
                    'paymongo_payment_id' => $reservation->paymongo_payment_id
                ]);
            }

            return response()->json(['success' => true, 'message' => 'Reservation cancelled. Full refund will be issued (if payment previously made).']);
        } elseif ($hoursDiff < 24 && $hoursDiff > 0) {
            // Less than 1 day → non-refundable
            $reservation->status = 'Cancelled';
            $reservation->save();

            return response()->json(['success' => true, 'message' => 'Reservation cancelled. Less than 24 hours before check-in, so payment is non-refundable.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Cannot cancel past reservations.']);
        }
    }

    public function cancelEventReservation($id)
    {
        $res = EventModel::where('event_reservation_id', $id)->first();
        if (!$res) return response()->json(['success' => false, 'message' => 'Reservation not found'], 404);
        $res->approval_status = 'Cancelled';
        $res->save();
        return response()->json(['success' => true, 'message' => 'Event reservation cancelled']);
    }

    private function refundPayMongoPayment($paymentId, $amount, $reservationId)
    {
        Log::info("💳 Initiating refund", [
            'reservation_id' => $reservationId,
            'payment_id' => $paymentId,
            'amount' => $amount
        ]);

        try {
            $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
                ->post("https://api.paymongo.com/v1/refunds", [
                    'data' => [
                        'attributes' => [
                            'amount' => (int)($amount * 100),
                            'reason' => 'requested_by_customer',
                            'payment_intent' => $paymentId // PayMongo expects payment_intent ID
                        ]
                    ]
                ]);

            $resp = $response->json();
            Log::info("💳 PayMongo refund response", ['reservation_id' => $reservationId, 'response' => $resp, 'status' => $response->status()]);

            return $response->ok();

        } catch (\Exception $ex) {
            Log::error("💳 Refund exception", ['reservation_id' => $reservationId, 'error' => $ex->getMessage()]);
            return false;
        }
    }
}
