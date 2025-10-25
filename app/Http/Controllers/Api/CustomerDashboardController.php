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
        $orders = FoodOrderModel::where('user_id', $user->id)->latest->get();
        return response()->json($orders);
    }

     public function getFarmOrders(Request $request)
    {
        $user = $request->user();
        $orders = FarmOrderModel::where('user_id', $user->id)->latest->get();
        return response()->json($orders);
    }

     public function getRoomReservations(Request $request)
    {
        $user = $request->user();
        $reservations = RoomModel::where('user_id', $user->id)->latest->get();
        return response()->json($reservations);
    }

    public function getEventReservations(Request $request)
    {
        $user = $request->user();
        $reservations = EventModel::where('user_id', $user->id)->latest->get();
        return response()->json($reservations);
    }
}
