<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\GoogleUser;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Contracts\Provider as Provider;
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

    // Create or update main User
    $user = User::updateOrCreate(
        ['email' => $googleUserData->getEmail()],
        [
            'name'     => $googleUserData->getName(),
            'password' => bcrypt(str()->random(16)),
        ]
    );

    // Create or update GoogleUser
    $googleUser = GoogleUser::updateOrCreate(
        ['user_id' => $user->id],
        [
            'email'  => $googleUserData->getEmail(),
            'avatar' => $googleUserData->getAvatar(),
            'role'   => 'customer' // default role
        ]
    );

    // ✅ Log in the main User model
    Auth::login($user);

    // Redirect based on role
    if ($googleUser->role === 'admin') {
        return redirect('/AdminPage.html');
    }

    return redirect('/');
}

}
