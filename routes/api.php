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
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ApprovalController;
use App\Http\Controllers\Api\HomePageController;
use \App\Http\Controllers\Api\PaymongoWebhookController;
use App\Http\Controllers\Api\NotificationController;
use App\Models\EventAdminModel;
use App\Models\RoomSeederModel;
use App\Models\GoogleUser;

Route::middleware(['auth:sanctum'])->get('/user-info', function (Request $request) {
    $user = $request->user()->load('googleAccount');

    // If user customized avatar, use it.
    $finalAvatar = $user->googleAccount?->avatar 
        ? url($user->googleAccount->avatar)
        : ($user->avatar ?? null);

    return response()->json([
        'is_logged_in' => true,
        'user' => [
            'id'     => $user->id,
            'name'   => $user->googleAccount?->name ?? $user->name,
            'email'  => $user->email,
            'avatar' => $finalAvatar,
            'role'   => $user->googleAccount?->role ?? 'customer',
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
Route::delete('/farmOrder/{id}/delete', [FarmOrderController::class, 'deleteFarmOrder']);



// Food Order routes

Route::get('/paymentSuccessFood', [FoodOrderController::class, 'paymentSuccess']);
Route::get('/paymentFailedFood', [FoodOrderController::class, 'paymentFailed']);
Route::get('foodProducts', [FoodProductController::class, 'index']);
Route::get('foodOrder', [FoodOrderController::class, 'index']);
Route::delete('/foodOrder/{foodOrder}/delete', [FoodOrderController::class, 'delete']);



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
Route::get('/room/paymentSuccess', [RoomController::class, 'paymentSuccess']);
Route::get('/room/paymentFailed', [RoomController::class, 'paymentFailed']);
Route::get('roomReser', [RoomController::class, 'index']);
Route::get('/booked-dates', [RoomController::class, 'getBookedDates']);
Route::post('/roomReservation/{id}/update-status', [RoomController::class, 'updateStatus']);
Route::post('/room/paymongoWebhook', [RoomController::class, 'paymongoWebhook']);



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

Route::post('/customer/cancel-food/{id}', [CustomerDashboardController::class, 'cancelFoodOrder']);
Route::post('/customer/cancel-farm/{id}', [CustomerDashboardController::class, 'cancelFarmOrder']);
Route::middleware('auth:sanctum')->post('/customer/cancel-room/{roomReserId}', [CustomerDashboardController::class, 'cancelRoomReservation']);
Route::post('/customer/cancel-event/{id}', [CustomerDashboardController::class, 'cancelEventReservation']);



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

//Review Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/submit-review', [ReviewController::class, 'submit']);
});
Route::get('/reviews', [ReviewController::class, 'adminList']);
Route::post('/reviews/{id}/mark-reviewed', [ReviewController::class, 'markReviewed']);
Route::delete('/reviews/{id}', [ReviewController::class, 'deleteReview']);

// Approval Routes
Route::get('/google-users', [ApprovalController::class, 'getGoogleUsers']);
Route::post('/google-users/{id}/update-id-status', [ApprovalController::class, 'updateIdStatus']);

// Home Page Events Route
Route::prefix('home-events')->group(function () {
Route::get('/', [HomePageController::class, 'index']);
Route::post('/', [HomePageController::class, 'store']);
Route::put('/{id}', [HomePageController::class, 'update']);
Route::delete('/{id}', [HomePageController::class, 'destroy']);
});

//Paymongo

Route::post('/webhook/paymongo', [PaymongoWebhookController::class, 'handleWebhook']);

Route::middleware('auth:sanctum')
    ->get('/notifications-counts', [NotificationController::class, 'getCounts']);
