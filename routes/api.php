<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\FarmOrderController;
use App\Http\Controllers\Api\FoodOrderController;
use App\Http\Controllers\Api\EventAdminReservationController;
use App\Http\Controllers\Api\FarmProductController;
use App\Models\EventAdminModel;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    Log::info("Authenticated user class: " . get_class($request->user()));
    Log::info("Authenticated user ID: " . $request->user()?->id);

    $user = $request->user();
    $googleUser = $user->googleAccount;

    return [
        'id'     => $user->id,
        'name'   => $user->name,
        'email'  => $user->email,
        'avatar' => $googleUser?->avatar,
        'role'   => $googleUser?->role ?? 'customer'
    ];
});

Route::post('cottageReservation', [RoomController::class, 'store']);

Route::post('eventReservation', [EventController::class, 'store']);

Route::post('foodOrder', [FoodOrderController::class, 'store']);

// Farm Order routes
Route::get('farmProducts', [FarmProductController::class, 'index']);


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
