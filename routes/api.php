<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\FarmOrderController;
use App\Http\Controllers\Api\FoodOrderController;
use App\Http\Controllers\Api\EventAdminReservationController;
use App\Models\EventAdminModel;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('cottageReservation', [RoomController::class, 'store']);

Route::post('eventReservation', [EventController::class, 'store']);

Route::post('foodOrder', [FoodOrderController::class, 'store']);

// Farm Order routes
Route::post('farmOrder/create-link', [FarmOrderController::class, 'createPaymentLink']);




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
