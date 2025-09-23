<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoomController extends Controller
{
     public function store(Request $request)
    {

         Log::info('Incoming request:', $request->all());
        
           $cottage = RoomModel::create([
            'check_in_date' => $request->check_in_date,
            'check_out_date' => $request->check_out_date,
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'pax' => $request->pax,
            'room' => $request->room,
            'payment_method'  => $request->payment_method,
            'payment_status' => "Pending"
        ]);

        return response()->json([
            'message' => 'Cottage reservation created successfully',
            'data' => $cottage
        ], 201);
    }
}
