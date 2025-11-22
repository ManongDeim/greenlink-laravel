<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\GoogleUser;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        $user = GoogleUser::where('email', $request->user()->email)->first();

        if (!$user) return response()->json(['success' => false, 'message' => 'User not found']);

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|max:2048'
        ]);

        $user = GoogleUser::where('email', $request->user()->email)->first();
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found']);

        $user->name = $request->name;

        // --------- AVATAR UPLOAD (food product method) ----------
        if ($request->hasFile('avatar')) {

            // Delete old file
            if ($user->avatar && Storage::disk('public')->exists(str_replace("/storage/", "", $user->avatar))) {
                Storage::disk('public')->delete(str_replace("/storage/", "", $user->avatar));
            }

            // Save new image
            $path = $request->file('avatar')->store('avatars', 'public');

            // Store database path
            $user->avatar = "/storage/" . $path;
        }

        $user->save();

        return response()->json(['success' => true, 'user' => $user]);
    }

    public function submitID(Request $request)
    {
        $request->validate([
            'id_photo' => 'required|image|max:4096',
        ]);

        $user = GoogleUser::where('email', $request->user()->email)->first();
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found']);

        // --------- ID UPLOAD (food product method) ----------
        if ($user->id_photo && Storage::disk('public')->exists(str_replace("/storage/", "", $user->id_photo))) {
            Storage::disk('public')->delete(str_replace("/storage/", "", $user->id_photo));
        }

        $path = $request->file('id_photo')->store('ids', 'public');

        $user->id_photo = "/storage/" . $path;
        $user->id_status = "Pending Validation";
        $user->save();

        return response()->json(['success' => true, 'user' => $user]);
    }
}
