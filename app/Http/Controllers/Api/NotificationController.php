<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FoodOrderModel;
use App\Models\FarmOrderModel;
use App\Models\RoomReservationModel;
use App\Models\EventAdminModel;

class NotificationController extends Controller
{
    public function getCounts()
    {
        $food = FoodOrderModel::where('order_status', 'Pending')->count();
        $farm = FarmOrderModel::where('order_status', 'Pending')->count();
        $room = RoomReservationModel::where('status', 'Pending')->count();
        $event = EventAdminModel::where('status', 'Pending')->count();

        return response()->json([
            'food' => $food,
            'farm' => $farm,
            'room' => $room,
            'event' => $event,
        ]);
    }
}
