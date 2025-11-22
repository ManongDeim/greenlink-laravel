<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\GoogleUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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

        Log::info('Google callback called', [
            'email' => $email,
            'googleName' => $googleName,
            'googleAvatar' => $googleAvatar,
        ]);

        // 1) Create main User only if not exists. Do NOT overwrite existing name.
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $googleName,
                'password' => bcrypt(str()->random(16)),
            ]
        );

        Log::info('Main user found or created', ['user' => $user]);

        // 2) Create or update GoogleUser record
        $googleUser = GoogleUser::where('user_id', $user->id)->first();

        if (!$googleUser) {
            // First time login, create record
            $googleUser = GoogleUser::create([
                'user_id' => $user->id,
                'email'   => $email,
                'name'    => $googleName,
                'avatar'  => $googleAvatar,
                'role'    => 'customer'
            ]);
            Log::info('GoogleUser created', ['googleUser' => $googleUser]);
        } else {
            // Only update Google avatar if the user hasn't uploaded a custom one
            $existingAvatar = $googleUser->avatar ?? null;
            $isCustomAvatar = $existingAvatar && str_starts_with($existingAvatar, '/avatars');

            if (!$isCustomAvatar) {
                $googleUser->avatar = $googleAvatar;
                Log::info('Google avatar updated', ['avatar' => $googleAvatar]);
            } else {
                Log::info('Custom avatar preserved', ['avatar' => $existingAvatar]);
            }

            // Only set name if empty (first login)
            if (!$googleUser->name || $googleUser->name === $googleName) {
                $googleUser->name = $googleName;
                Log::info('GoogleUser name set', ['name' => $googleName]);
            } else {
                Log::info('Custom name preserved', ['name' => $googleUser->name]);
            }

            $googleUser->email = $email; // keep email in sync
            $googleUser->save();
            Log::info('GoogleUser saved', ['googleUser' => $googleUser]);
        }

        // Login main user
        Auth::login($user);

        return redirect('/');
    }
}
