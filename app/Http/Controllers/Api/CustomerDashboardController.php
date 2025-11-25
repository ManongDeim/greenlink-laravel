<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FoodOrderModel;
use App\Models\FarmOrderModel;
use App\Models\RoomModel;
use App\Models\EventModel;

class CustomerDashboardController extends Controller
{
    public function getFoodOrders(Request $request)
    {
        $user = $request->user();
        $orders = FoodOrderModel::where('user_id', $user->id)  ->orderBy('id', 'desc')->get();
        return response()->json($orders);
    }

     public function getFarmOrders(Request $request)
    {
        $user = $request->user();
        $orders = FarmOrderModel::where('user_id', $user->id)  ->orderBy('id', 'desc')->get();
        return response()->json($orders);
    }

     public function getRoomReservations(Request $request)
    {
        $user = $request->user();
        $reservations = RoomModel::where('user_id', $user->id)  ->orderBy('id', 'desc')->get();
        return response()->json($reservations);
    }

    public function getEventReservations(Request $request)
    {
        $user = $request->user();
        $reservations = EventModel::where('user_id', $user->id)  ->orderBy('id', 'desc')->get();
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
    $res = RoomModel::where('room_reser_id', $id)->first();
    if (!$res) return response()->json(['success' => false, 'message' => 'Reservation not found'], 404);
    $res->status = 'Cancelled';
    $res->save();
    return response()->json(['success' => true, 'message' => 'Room reservation cancelled']);
}

public function cancelEventReservation($id)
{
    $res = EventModel::where('event_reservation_id', $id)->first();
    if (!$res) return response()->json(['success' => false, 'message' => 'Reservation not found'], 404);
    $res->approval_status = 'Cancelled';
    $res->save();
    return response()->json(['success' => true, 'message' => 'Event reservation cancelled']);
}

}
