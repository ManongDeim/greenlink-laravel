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
        $google = GoogleUser::where('email', $userEmail)->first();

        if (!$google) return response()->json(['success' => false, 'message' => 'User not found']);

        return response()->json(['success' => true, 'user' => $google]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $userEmail = $request->user()->email;

        // Update User (main) so header shows the edited name
        $mainUser = User::where('email', $userEmail)->first();
        if ($mainUser) {
            $mainUser->name = $request->input('name');
            $mainUser->save();
        }

        // Update GoogleUser record
        $google = GoogleUser::where('email', $userEmail)->first();
        if (!$google) return response()->json(['success' => false, 'message' => 'User not found']);

        if ($request->hasFile('avatar')) {
    $file = $request->file('avatar');
    $filename = uniqid() . '.' . $file->getClientOriginalExtension();
    $path = public_path('avatars');
    if (!file_exists($path)) mkdir($path, 0775, true);
    $file->move($path, $filename);

    if ($google->avatar && file_exists(public_path(str_replace(url('/'), '', $google->avatar)))) {
        try { unlink(public_path(str_replace(url('/'), '', $google->avatar))); } catch (\Throwable $e) { Log::warning("Could not unlink old avatar: ".$e->getMessage()); }
    }

    $google->avatar = asset("avatars/{$filename}");
}


        $google->save();

        return response()->json(['success' => true, 'user' => $google]);
    }

    public function submitID(Request $request)
    {
        $request->validate([
            'id_photo' => 'required|image|max:4096',
        ]);

        $userEmail = $request->user()->email;
        $google = GoogleUser::where('email', $userEmail)->first();
        if (!$google) return response()->json(['success' => false, 'message' => 'User not found']);

        $file = $request->file('id_photo');
        $filename = uniqid().'.'.$file->getClientOriginalExtension();
        $path = public_path('ids');
        if (!file_exists($path)) mkdir($path, 0775, true);
        $file->move($path, $filename);

        if ($google->id_photo && file_exists(public_path($google->id_photo))) {
            try { unlink(public_path($google->id_photo)); } catch (\Throwable $e) { Log::warning("Could not unlink old id_photo: ".$e->getMessage()); }
        }

        $google->id_photo = "/ids/{$filename}";
        $google->id_status = "Pending Validation";
        $google->save();

        return response()->json(['success' => true, 'user' => $google]);
    }
}
