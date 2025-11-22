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
use App\Http\Controllers\Api\EventSeederController;
use App\Http\Controllers\Api\CustomerDashboardController;
use App\Http\Controllers\Api\KitchenInventoryController;
use App\Http\Controllers\Api\FarmInventoryController;
use App\Models\EventAdminModel;
use App\Models\RoomSeederModel;
use App\Models\GoogleUser;

Route::middleware(['auth:sanctum'])->get('/user-info', function (Request $request) {
    $email = $request->user()->email;

    $googleUser = GoogleUser::where('email', $email)->first();

    if (!$googleUser) {
        return response()->json([
            'is_logged_in' => false,
            'message' => 'Google user not found'
        ], 404);
    }

    return response()->json([
        'is_logged_in' => true,
        'user' => [
            'id'     => $googleUser->user_id,
            'name'   => $googleUser->name,
            'email'  => $googleUser->email,
            'avatar' => $googleUser->avatar,
            'role'   => $googleUser->role ?? 'customer',
        ],
        'session_data' => session()->all()
    ]);
});



Route::post('cottageReservation', [RoomController::class, 'store']);
Route::post('foodOrder', [FoodOrderController::class, 'store']);

Route::post('/add-food-products', [FoodProductController::class, 'store']);


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
Route::get('/paymentSuccessFarm', [FarmOrderController::class, 'paymentSuccess']);
Route::get('/paymentFailedFarm', [FarmOrderController::class, 'paymentFailed']);
Route::get('farmOrder', [FarmOrderController::class, 'index']);
Route::post('farmOrder/{farmOrderId}/update-status', [FarmOrderController::class, 'updateStatus']);


// Food Order routes

Route::get('/paymentSuccessFood', [FoodOrderController::class, 'paymentSuccess']);
Route::get('/paymentFailedFood', [FoodOrderController::class, 'paymentFailed']);
Route::get('foodProducts', [FoodProductController::class, 'index']);
Route::get('foodOrder', [FoodOrderController::class, 'index']);


// Room Routes

Route::get('rooms', [RoomSeederController::class, 'index']);
Route::get('/rooms/{id}', function($id) {
     $room = RoomSeederModel::findOrFail($id);

    if (is_string($room->carousel_images)) {
        $decoded = json_decode($room->carousel_images, true);
        $room->carousel_images = is_array($decoded) ? $decoded : [];
    }

    return response()->json($room);
});
Route::post('/create-room-payment', [RoomController::class, 'createPaymentLink'])->middleware('auth:sanctum');
Route::get('/paymentSuccess', [RoomController::class, 'paymentSuccess']);
Route::get('/paymentFailed', [RoomController::class, 'paymentFailed']);
Route::get('roomReser', [RoomController::class, 'index']);
Route::get('/booked-dates', [RoomController::class, 'getBookedDates']);
Route::post('/roomReservation/{id}/update-status', [RoomController::class, 'updateStatus']);


// Event Seeder Routes
Route::get('events', [EventSeederController::class, 'index']);

// Event Routes

Route::middleware('auth:sanctum')->post('/event-reservations', [EventController::class, 'store']);
Route::get('/event-reservations', [EventController::class, 'index']);
Route::post('/eventReservation/{id}/update-status', [EventController::class, 'updateStatus']);

// Customer Dashboard Routes

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/customer/food-orders', [CustomerDashboardController::class, 'getFoodOrders']);
    Route::get('/customer/farm-orders', [CustomerDashboardController::class, 'getFarmOrders']);
    Route::get('/customer/room-reservations', [CustomerDashboardController::class, 'getRoomReservations']);
    Route::get('/customer/event-reservations', [CustomerDashboardController::class, 'getEventReservations']);
});


// Kitchen Inventory Routes


Route::get('/inventory', [KitchenInventoryController::class, 'index']);
Route::post('/inventory', [KitchenInventoryController::class, 'store']);
Route::post('/inventory/add-stock/{id}', [KitchenInventoryController::class, 'addStock']);
Route::delete('/inventory/{id}', [KitchenInventoryController::class, 'destroy']);
Route::post('/kitchenInventory/{id}/spoilage', [KitchenInventoryController::class, 'recordSpoilage']);

// Farm Inventory Routes
Route::get('farmInventory', [FarmInventoryController::class, 'index']);
Route::post('farmInventoryStore', [FarmInventoryController::class, 'store']);
Route::delete('farmInventory/{id}', [FarmInventoryController::class, 'destroy']);
Route::post('farmInventory/add-stock/{id}', [FarmInventoryController::class, 'addStock']);
Route::post('farmInventory/{id}/spoilage', [FarmInventoryController::class, 'recordSpoilage']);

// Food Item Routes

Route::get('/food-products/{id}/ingredients', [FoodProductController::class, 'getExistingIngredients']);
Route::post('/food-products/{id}/ingredients/update', [FoodProductController::class, 'updateIngredients']);
Route::delete('/delete-food/{id}', [FoodProductController::class, 'destroy']);


//Room Routes

Route::post('/rooms/add', [RoomSeederController::class, 'store']);
Route::delete('/rooms/delete-room/{id}', [RoomSeederController::class, 'destroy']);

