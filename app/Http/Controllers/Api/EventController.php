<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\EventModel;

class EventController extends Controller
{
    public function store(Request $request)
    {
       
         Log::info('Incoming request:', $request->all());
        
           $cottage = EventModel::create([
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'full_name' => $request->full_name,
            'event_type' => $request->event_type,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'pax' => $request->pax,
            'to_bring' => $request->to_bring,
            'approval_status' => "Pending"
        ]);

        return response()->json([
            'message' => 'Cottage reservation created successfully',
            'data' => $cottage
        ], 201);
    }
}
