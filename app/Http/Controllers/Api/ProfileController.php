<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\GoogleUser;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        $userEmail = $request->user()->email;
        Log::info("getProfile called for user: $userEmail");

        $google = GoogleUser::where('email', $userEmail)->first();

        if (!$google) {
            Log::warning("getProfile: GoogleUser not found for $userEmail");
            return response()->json(['success' => false, 'message' => 'User not found']);
        }

        Log::info("getProfile: Returning GoogleUser", ['user' => $google->toArray()]);
        return response()->json(['success' => true, 'user' => $google]);
    }

    public function updateProfile(Request $request)
    {
        Log::info("updateProfile called", [
            'request_data' => $request->all(),
            'has_file' => $request->hasFile('avatar')
        ]);

        $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $userEmail = $request->user()->email;
        Log::info("updateProfile: User email: $userEmail");

        // Update User (main) so header shows the edited name
        $mainUser = User::where('email', $userEmail)->first();
        if ($mainUser) {
            $mainUser->name = $request->input('name');
            $mainUser->save();
            Log::info("updateProfile: Main User name updated", ['main_user' => $mainUser->toArray()]);
        } else {
            Log::warning("updateProfile: Main User not found for $userEmail");
        }

        // Update GoogleUser record
        $google = GoogleUser::where('email', $userEmail)->first();
        if (!$google) {
            Log::warning("updateProfile: GoogleUser not found for $userEmail");
            return response()->json(['success' => false, 'message' => 'User not found']);
        }

        $google->name = $request->input('name');
        Log::info("updateProfile: GoogleUser name set to {$google->name}");

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $path = public_path('../../avatars');
            if (!file_exists($path)) mkdir($path, 0775, true);
            $file->move($path, $filename);
            Log::info("updateProfile: Avatar file moved", ['filename' => $filename, 'path' => $path]);

            if ($google->avatar && file_exists(public_path(str_replace(url('/'), '', $google->avatar)))) {
                try {
                    unlink(public_path(str_replace(url('/'), '', $google->avatar)));
                    Log::info("updateProfile: Old avatar deleted", ['old_avatar' => $google->avatar]);
                } catch (\Throwable $e) {
                    Log::warning("Could not unlink old avatar: " . $e->getMessage());
                }
            }

            $google->avatar = "/avatars/{$filename}";
            Log::info("updateProfile: GoogleUser avatar updated", ['avatar_url' => $google->avatar]);
        }

        $google->save();
        Log::info("updateProfile: GoogleUser saved successfully", ['google_user' => $google->toArray()]);

        return response()->json(['success' => true, 'user' => $google]);
    }

    public function submitID(Request $request)
    {
        Log::info("submitID called", [
            'has_file' => $request->hasFile('id_photo')
        ]);

        $request->validate([
            'id_photo' => 'required|image|max:4096',
        ]);

        $userEmail = $request->user()->email;
        $google = GoogleUser::where('email', $userEmail)->first();
        if (!$google) {
            Log::warning("submitID: GoogleUser not found for $userEmail");
            return response()->json(['success' => false, 'message' => 'User not found']);
        }

        $file = $request->file('id_photo');
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
        $path = public_path('../../ids');
        if (!file_exists($path)) mkdir($path, 0775, true);
        $file->move($path, $filename);
        Log::info("submitID: ID file moved", ['filename' => $filename, 'path' => $path]);

        if ($google->id_photo && file_exists(public_path($google->id_photo))) {
            try {
                unlink(public_path($google->id_photo));
                Log::info("submitID: Old ID photo deleted", ['old_id' => $google->id_photo]);
            } catch (\Throwable $e) {
                Log::warning("Could not unlink old id_photo: " . $e->getMessage());
            }
        }

        $google->id_photo = asset("ids/{$filename}");
        $google->id_status = "Pending Validation";
         Log::info("updateProfile: GoogleUser avatar updated", ['avatar_url' => $google->avatar]);
        $google->save();
         Log::info("updateProfile: GoogleUser saved successfully", ['google_user' => $google->toArray()]);
        Log::info("submitID: GoogleUser ID updated", ['google_user' => $google->toArray()]);

        return response()->json(['success' => true, 'user' => $google]);
    }
}
