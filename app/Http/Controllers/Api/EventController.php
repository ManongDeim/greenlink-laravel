<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\EventModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized. Please log in.'], 401);
        }

        // Validate input
        $validated = $request->validate([
            'event_id' => 'required|integer',
            'start_datetime' => 'required|date_format:Y-m-d h:i A',
            'end_datetime' => 'required|date_format:Y-m-d h:i A|after_or_equal:start_datetime',
            'full_name' => 'required|string|max:255',
            'event_type' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'required|string|max:11',
            'pax' => 'required|integer|min:1',
            'to_bring' => 'nullable|string',
        ]);

        // Convert 12-hour to 24-hour for DB
        $startDatetime24 = date('Y-m-d H:i:s', strtotime($validated['start_datetime']));
        $endDatetime24 = date('Y-m-d H:i:s', strtotime($validated['end_datetime']));

        // Wrap in transaction
        $reservation = DB::transaction(function () use ($user, $validated, $startDatetime24, $endDatetime24) {
            // Create reservation
            $reservation = EventModel::create([
                'user_id' => $user->id,
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

            // ----------------------
            // Send Emails
            // ----------------------

            try {
                // 1️⃣ Admin emails
                $adminEmails = [
                    "greenlinklolasayong@gmail.com",
                    "deimdgreat@gmail.com",
                ];

                $subjectAdmin = "New Event Reservation – {$reservation->event_type}";
                $messageAdmin = "A new event reservation has been created.\n\n" .
                                "Full Name: {$reservation->full_name}\n" .
                                "Event Type: {$reservation->event_type}\n" .
                                "Check-In: {$validated['start_datetime']}\n" .
                                "Check-Out: {$validated['end_datetime']}\n" .
                                "Pax: {$reservation->pax}\n" .
                                "Phone: {$reservation->phone_number}\n" .
                                "Email: {$reservation->email}\n" .
                                "Things to bring: {$reservation->to_bring}\n";

                foreach ($adminEmails as $email) {
                    Mail::raw($messageAdmin, function ($message) use ($email, $subjectAdmin) {
                        $message->to($email)
                                ->subject($subjectAdmin);
                    });
                }

                // 2️⃣ Customer email
                $subjectCustomer = "Your Event Reservation – {$reservation->event_type}";
                $messageCustomer = "Hello {$reservation->full_name},\n\n" .
                                   "Thank you for your reservation! Here are your reservation details:\n\n" .
                                   "Event Type: {$reservation->event_type}\n" .
                                   "Check-In: {$validated['start_datetime']}\n" .
                                   "Check-Out: {$validated['end_datetime']}\n" .
                                   "Pax: {$reservation->pax}\n" .
                                   "Phone: {$reservation->phone_number}\n" .
                                   "Things to bring: {$reservation->to_bring}\n\n" .
                                   "Please wait for admin approval.\n\n" .
                                   "Best regards,\nLola Sayong Eco Surf-Farm";

                Mail::raw($messageCustomer, function ($message) use ($reservation, $subjectCustomer) {
                    $message->to($reservation->email)
                            ->subject($subjectCustomer);
                });

            } catch (\Exception $e) {
                Log::error("❌ Failed to send reservation emails: " . $e->getMessage());
            }

            return $reservation;
        });

        return response()->json([
            'message' => 'Reservation saved successfully and emails sent.',
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
