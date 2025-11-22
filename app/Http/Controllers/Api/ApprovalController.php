<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GoogleUser;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{
    public function getGoogleUsers() {
    // Fetch all users with pending ID approval
    $users = GoogleUser::select('user_id', 'name', 'email', 'id_photo', 'id_status')
                        ->where('id_status', 'Pending')
                        ->get();
    return response()->json($users);
}

public function updateIdStatus(Request $request, $id) {
    $request->validate([
        'id_status' => 'required|in:Validated,Rejected'
    ]);

    $user = GoogleUser::find($id);
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->id_status = $request->id_status;
    $user->save();

    return response()->json(['message' => 'ID status updated']);
}

}
