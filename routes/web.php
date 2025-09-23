<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Api\FarmOrderController;

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

// Farm Order routes

Route::get('/farmOrders/payment-success', [FarmOrderController::class, 'paymentSuccess'])
    ->name('farmOrders.paymentSuccess');

Route::get('/farmOrders/payment-failed', [FarmOrderController::class, 'paymentFailed'])
    ->name('farmOrders.paymentFailed');