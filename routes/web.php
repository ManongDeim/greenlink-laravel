<?php

use App\Http\Controllers\Api\EventSeederController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Api\FarmOrderController;
use App\Http\Controllers\Api\FoodOrderController;
use App\Http\Controllers\Api\FarmProductController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\FoodProductController;
use App\Http\Controllers\Api\RoomSeederController;
use App\Models\FoodOrderModel;

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
            'role' => $user->googleAccount->role ?? 'customer'
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
        'email' => Auth::check() ? Auth::user()->email : null
    ]);
});



// Farm Order routes

Route::post('/api/farmOrder/create-link', [FarmOrderController::class, 'createPaymentLink'])
    ->middleware('auth');


// Food Order routes
Route::post('/api/foodOrder/create-link', [FoodOrderController::class, 'createPaymentLink'])
    ->middleware('auth');
Route::post('/api/foodOrder/{id}/update-status', function(Request $request, $id) {
    $order = FoodOrderModel::where('foodOrder_id', $id)->first();
    if(!$order) return response()->json(['error' => 'Order not found'], 404);

    $order->update(['order_status' => $request->input('order_status')]);
    return response()->json(['message' => "Order #{$order->foodOrder_id} marked as {$request->input('order_status')}"]);
});


// Room Reservation routes
Route::post('/create-room-payment', [RoomController::class, 'createPaymentLink'])->middleware('auth');
Route::get('/paymentSuccess', [RoomController::class, 'paymentSuccess']);
Route::get('/paymentFailed', [RoomController::class, 'paymentFailed']);

// Farm Product routes

Route::prefix('api/farm')->group(function () {
    Route::post('/edit-name/{id}', [FarmProductController::class, 'editName']);
    Route::post('/edit-price/{id}', [FarmProductController::class, 'editPrice']);
    Route::post('/replace-photo/{id}', [FarmProductController::class, 'replacePhoto']);
    Route::post('/add-stock/{id}', [FarmProductController::class, 'addStock']);
});

// Food Product routes

Route::prefix('api/food')->group(function () {
    Route::post('/edit-name/{id}', [FoodProductController::class, 'editName']);
    Route::post('/edit-price/{id}', [FoodProductController::class, 'editPrice']);
    Route::post('/replace-photo/{id}', [FoodProductController::class, 'replacePhoto']);
});

// Room Seeder routes

Route::prefix('api/room')->group(function () {
    Route::post('/edit-name/{id}', [RoomSeederController::class, 'editName']);
    Route::post('/edit-price/{id}', [RoomSeederController::class, 'editPrice']);
    Route::post('/replace-photo/{id}', [RoomSeederController::class, 'replacePhoto']);
});

// Event Management routes

Route::prefix('api/event-management')->group(function () {
    Route::post('/add', [EventSeederController::class, 'store']);
    Route::post('/edit-event-name/{id}', [EventSeederController::class, 'editName']);
    Route::post('/edit-pax/{id}', [EventSeederController::class, 'editPax']);
    Route::post('/remove/{id}', [EventSeederController::class, 'destroy']);
});