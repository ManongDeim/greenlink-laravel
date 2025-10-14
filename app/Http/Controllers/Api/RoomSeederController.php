<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RoomSeederModel as Room;

class RoomSeederController extends Controller
{
     public function index()
    {
         $rooms = Room::all()->map(function ($room) {
        // Decode the carousel_images if it's a JSON string
        if (is_string($room->carousel_images)) {
            $decoded = json_decode($room->carousel_images, true);
            $room->carousel_images = is_array($decoded) ? $decoded : [];
        }
        return $room;
    });

    return response()->json($rooms);
    }

    
}
