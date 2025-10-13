<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RoomSeederModel as Room;

class RoomSeederController extends Controller
{
     public function index()
    {
        return response()->json(Room::all());
    }

    
}
