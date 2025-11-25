<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\FoodOrderModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\KitchenInventory;
use App\Models\FoodIngredient;
use App\Models\FoodProduct;
use App\Models\GoogleUser;

class FoodOrderController extends Controller
{
    public function createPaymentLink(Request $request)
    {
        Log::info('Incoming request:', $request->all());

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized. Please log in first.'], 401);
        }

        // Check for validated senior or PWD ID
        $googleUser = GoogleUser::where('user_id', $user->id)->first();
        $hasDiscount = $googleUser && $googleUser->id_status === 'Validated';

        // Wrap everything in a transaction to prevent race conditions
        $order = DB::transaction(function () use ($request, $user, $hasDiscount) {

            // Generate unique FOOD order ID (safe under concurrency)
            do {
                $foodOrderId = 'FOOD-'. mt_rand(1,99999);
            } while (FoodOrderModel::where('foodOrder_id', $foodOrderId)->exists());

            // Generate unique reference number for PayMongo
            $refNumber = uniqid('REF-');

            // Prepare initial order data
            $orderData = [
                'foodOrder_id' => $foodOrderId,
                'user_id' => $user->id,
                'smokedFish_order' => 0,
                'deviledFish_order' => 0,
                'seaSig_order' => 0,
                'blueCraze_order' => 0,
                'chickenSheet_order' => 0,
                'blackMeal_order' => 0,
                'total_bill' => 0,
                'payment_method' => 'GCash',
                'payment_status' => 'Pending',
                'order_status' => 'Pending',
                'ref_number' => $refNumber,
            ];

            foreach ($request->cart as $item) {
                switch ($item['name']) {
                    case 'Smoked Fish': $orderData['smokedFish_order'] = $item['qty']; break;
                    case 'Deviled Fish': $orderData['deviledFish_order'] = $item['qty']; break;
                    case 'Sea Sig': $orderData['seaSig_order'] = $item['qty']; break;
                    case 'Blue Craze': $orderData['blueCraze_order'] = $item['qty']; break;
                    case 'Chicken Sheet': $orderData['chickenSheet_order'] = $item['qty']; break;
                    case 'Black Meal': $orderData['blackMeal_order'] = $item['qty']; break;
                }

                $subtotal = $item['price'] * $item['qty'];

                // Apply 20% discount if user is senior/PWD
                if ($hasDiscount) {
                    $subtotal *= 0.8;
                }

                $orderData['total_bill'] += $subtotal;
            }

            return FoodOrderModel::create($orderData);
        });

        // Prepare PayMongo request
        $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
            ->post('https://api.paymongo.com/v1/checkout_sessions', [
                'data' => [
                    'attributes' => [
                        'line_items' => array_map(function ($item) use ($hasDiscount) {
                            $price = $item['price'];
                            if ($hasDiscount) $price *= 0.8;
                            return [
                                'currency' => 'PHP',
                                'amount'   => intval($price * 100),
                                'name'     => $item['name'],
                                'quantity' => $item['qty'],
                            ];
                        }, $request->cart),
                        'payment_method_types' => ['gcash'],
                        'amount' => intval($order->total_bill * 100),
                        'description' => "Food Order Ref: {$order->ref_number}",
                        'remarks' => $order->ref_number,
                        'currency' => 'PHP',
                        'show_line_items' => true,
                        'show_description' => true,
                        'success_url' => 'https://greenlinklolasayong.site/api/paymentSuccessFood?ref=' . $order->ref_number,
                        'cancel_url' => 'https://greenlinklolasayong.site/api/paymentFailedFood?ref=' . $order->ref_number,
                    ]
                ]
            ]);

        $checkoutUrl = $response->json()['data']['attributes']['checkout_url'] ?? null;

        Log::info('PayMongo response', $response->json());

        return response()->json([
            'payment_url' => $checkoutUrl,
            'foodOder_id' => $order->foodOrder_id,
            'ref_number' => $order->ref_number,
            'hasDiscount' => $hasDiscount,
            'total_bill' => $order->total_bill
        ]);
    }

    // ... Keep the rest of your controller as is (paymentSuccess, paymentFailed, index, delete)
}
