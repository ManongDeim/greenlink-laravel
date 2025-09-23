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

        $googleUser = $driver->stateless()->user();

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'password' => null,
            ]
        );

         GoogleUser::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'user_id' => $user->id,
                'avatar'  => $googleUser->getAvatar(),
            ]
        );

        Auth::login($user);

        return redirect('/index.html');
    }

    
}
