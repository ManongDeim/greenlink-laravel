<?php

// app/Http/Controllers/ProfileController.php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\GoogleUser;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        $userEmail = $request->user()->email;
        $user = GoogleUser::where('email', $userEmail)->first();

        if (!$user) return response()->json(['success' => false, 'message' => 'User not found']);

        return response()->json(['success' => true, 'user' => $user]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $user = GoogleUser::where('email', $request->user()->email)->first();
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found']);

        $user->full_name = $request->full_name;

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = uniqid().'.'.$file->getClientOriginalExtension();
            $path = public_path('avatars');
            if (!file_exists($path)) mkdir($path, 0775, true);
            $file->move($path, $filename);

            if ($user->avatar && file_exists(public_path($user->avatar))) unlink(public_path($user->avatar));

            $user->avatar = "/avatars/$filename";
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

        $file = $request->file('id_photo');
        $filename = uniqid().'.'.$file->getClientOriginalExtension();
        $path = public_path('ids');
        if (!file_exists($path)) mkdir($path, 0775, true);
        $file->move($path, $filename);

        if ($user->id_file && file_exists(public_path($user->id_file))) unlink(public_path($user->id_file));

        $user->id_file = "/ids/$filename";
        $user->id_status = "Pending Validation";
        $user->save();

        return response()->json(['success' => true, 'user' => $user]);
    }
}
