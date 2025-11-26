<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\EventModel;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function store(Request $request)
    {
        // Ensure the user is authenticated
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized. Please log in.'], 401);
        }

        // Validate input using 12-hour format with AM/PM
        $validated = $request->validate([
            'event_id' => 'required|integer',
            'start_datetime' => 'required|date_format:Y-m-d h:i A', // 12-hour format
            'end_datetime' => 'required|date_format:Y-m-d h:i A|after_or_equal:start_datetime',
            'full_name' => 'required|string|max:255',
            'event_type' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'required|string|max:11',
            'pax' => 'required|integer|min:1',
            'to_bring' => 'nullable|string',
        ]);

        // Convert 12-hour format to 24-hour format before saving
        $startDatetime24 = date('Y-m-d H:i:s', strtotime($validated['start_datetime']));
        $endDatetime24 = date('Y-m-d H:i:s', strtotime($validated['end_datetime']));

        // Create the reservation
        $reservation = EventModel::create([
            'user_id' => $user->id, // automatically gets logged-in user's ID
            'event_id' => $validated['event_id'],
            'start_datetime' => $startDatetime24,
            'end_datetime' => $endDatetime24,
            'full_name' => $validated['full_name'],
            'event_type' => $validated['event_type'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'pax' => $validated['pax'],
            'to_bring' => $validated['to_bring'] ?? '',
            'approval_status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Reservation saved successfully.',
            'reservation' => $reservation,
        ], 201);
    }

    public function index()
    {
        return response()->json(EventModel::all());
    }

    public function updateStatus($id, Request $request)
    {
        $reservation = EventModel::where('event_reservation_id', $id)->first();

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        $reservation->approval_status = $request->status;
        $reservation->save();

        return response()->json(['message' => 'Status updated successfully']);
    }
}
