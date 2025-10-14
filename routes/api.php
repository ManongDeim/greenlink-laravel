<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\RoomSeederController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\FarmOrderController;
use App\Http\Controllers\Api\FoodOrderController;
use App\Http\Controllers\Api\EventAdminReservationController;
use App\Http\Controllers\Api\FarmProductController;
use App\Http\Controllers\Api\FoodProductController;
use App\Models\EventAdminModel;

Route::middleware(['auth:sanctum'])->get('/user-info', function (Request $request) {
     $user = $request->user()->load('googleAccount');

    return response()->json([
        'is_logged_in' => true,
        'user' => [
            'id'     => $user->id,
            'name'   => $user->name,
            'email'  => $user->email,
            'avatar' => $user->googleAccount?->avatar,
            'role'   => $user->googleAccount?->role ?? 'customer'
        ],
        'session_data' => session()->all()
    ]);
});



Route::post('cottageReservation', [RoomController::class, 'store']);

Route::post('eventReservation', [EventController::class, 'store']);

Route::post('foodOrder', [FoodOrderController::class, 'store']);


// Admin Routes

Route::get('/reservations/latest', function () {
    Log::info("API request: Fetch latest reservation");

    $reservation = EventAdminModel::latest('id')->first();

    if (!$reservation) {
        Log::warning("No reservations found in database");
        return response()->json(['error' => 'No reservations found'], 404);
    }

    Log::debug("Latest reservation data", $reservation->toArray());

    return response()->json($reservation);
});


Route::patch('/reservations/{id}/approval', [EventAdminReservationController::class, 'updateApproval']);

// Farm Order routes
Route::get('farmProducts', [FarmProductController::class, 'index']);
Route::get('/paymentSuccess', [FarmOrderController::class, 'paymentSuccess']);
Route::get('/paymentFailed', [FarmOrderController::class, 'paymentFailed']);

// Food Order routes

Route::get('/paymentSuccess', [FoodOrderController::class, 'paymentSuccess']);
Route::get('/paymentFailed', [FoodOrderController::class, 'paymentFailed']);
Route::get('foodProducts', [FoodProductController::class, 'index']);


// Room Routes

Route::get('rooms', [RoomSeederController::class, 'index']);