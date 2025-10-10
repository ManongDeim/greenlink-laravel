<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Api\FarmOrderController;

Route::get('/check-key', function () {
    return env('APP_KEY');
});


Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/', function () {
    return response()->file(public_path('homePage.html'));
});

require __DIR__.'/auth.php';

// Log-in routes

Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.redirect');

Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

Route::get('/api/user', function () {
    if (Auth::check()) {
        $user = \App\Models\User::with('googleAccount')->find(Auth::id());
        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->googleAccount->avatar ?? null,
        ]);
    }
    return response()->json(null, 401);
});


Route::get('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return response()->json(['success' => true]);
});

Route::get('/auth-status', function () {
    return response()->json([
        'logged_in' => Auth::check(),
    ]);
});



// Farm Order routes

Route::post('/api/farmOrder/create-link', [FarmOrderController::class, 'createPaymentLink'])
    ->middleware('auth');

Route::get('/farmOrders/payment-success', [FarmOrderController::class, 'paymentSuccess'])
    ->name('farmOrders.paymentSuccess');

Route::get('/farmOrders/payment-failed', [FarmOrderController::class, 'paymentFailed'])
    ->name('farmOrders.paymentFailed');
