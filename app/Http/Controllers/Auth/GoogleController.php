<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\GoogleUser;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        /** @var GoogleProvider $driver */
        $driver = Socialite::driver('google');
        $googleUserData = $driver->user();

        $email = $googleUserData->getEmail();
        $googleName = $googleUserData->getName();
        $googleAvatar = $googleUserData->getAvatar();

        // 1) Create main User only if not exists. Do NOT overwrite existing name.
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $googleName,
                'password' => bcrypt(str()->random(16)),
            ]
        );

        // 2) Create or update GoogleUser record.
        $googleUser = GoogleUser::where('user_id', $user->id)->first();

        if (!$googleUser) {
            // Create with values from Google
            $googleUser = GoogleUser::create([
                'user_id' => $user->id,
                'email'   => $email,
                'name'    => $googleName,
                'avatar'  => $googleAvatar,
                'role'    => 'customer'
            ]);
        } else {
            // Update name/email — but only update avatar if the existing avatar is NOT a custom upload
            // We treat custom avatars as local paths beginning with '/avatars' (you store custom avatars there)
            $googleUser->name = $googleName;
            $googleUser->email = $email;

            $existingAvatar = $googleUser->avatar ?? null;
            $isCustom = $existingAvatar && str_starts_with($existingAvatar, '/avatars');

            if (!$isCustom) {
                // safe to overwrite avatar with Google avatar
                $googleUser->avatar = $googleAvatar;
            }

            $googleUser->save();
        }

        // Login main user
        Auth::login($user);

        return redirect('/');
    }
}
