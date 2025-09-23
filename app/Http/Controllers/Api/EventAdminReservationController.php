<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\EventAdminModel;

class EventAdminReservationController extends Controller
{
     public function updateApproval(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Approved,Disapproved',
        ]);

        $reservation = EventAdminModel::findOrFail($id);
        $reservation->approval_status = $request->status;
        $reservation->save();

        return response()->json([
            'message' => 'Approval status updated successfully!',
            'reservation' => $reservation,
        ]);
    }
}
