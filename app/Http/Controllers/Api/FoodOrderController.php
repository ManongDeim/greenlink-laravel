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

class FoodOrderController extends Controller
{
    public function createPaymentLink(Request $request)
    {
        Log::info('Incoming request:', $request->all());

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized. Please log in first.'], 401);
        }

         // Wrap everything in a transaction to prevent race conditions
        $order = DB::transaction(function () use ($request, $user) {

            // Generate unique FOOD order ID (safe under concurrency)
            do {
                $foodOrderId = 'FOOD-'. mt_rand(1,99999);
            } while (FoodOrderModel::where('foodOrder_id', $foodOrderId)->exists());

            // Generate unique reference number for PayMongo
            $refNumber = uniqid('REF-');

            // Prepare initial order data
            $orderData = [
                'foodOrder_id' => $foodOrderId,
                'user_id' => $user->id, // ✅ taken automatically from logged-in user
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

            $lineitems = [];

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
                $orderData['total_bill'] += $subtotal;

                $lineitems[] = [
                    'currency' => 'PHP',
                    'amount'   => intval($item['price'] * 100),
                    'name'     => $item['name'],
                    'quantity' => $item['qty']
                ];
            }

            Log::info('Incoming user_id:', ['user_id' => $request->input('user_id')]);

            // Save to DB inside the transaction
        $orderData['user_id'] = $request->input('user_id');
            return FoodOrderModel::create($orderData);
        });

        // ✅ PayMongo API call
        $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
            ->post('https://api.paymongo.com/v1/checkout_sessions', [
                'data' => [
                    'attributes' => [
                        'line_items' => array_map(function ($item) {
                            return [
                                'currency' => 'PHP',
                                'amount' => intval($item['price'] * 100),
                                'name' => $item['name'],
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
            'ref_number' => $order->ref_number
        ]);
    }   

   public function paymentSuccess(Request $request)
{
    Log::info("✅ paymentSuccess route hit", [
        'full_url' => $request->fullUrl(),
        'ref' => $request->query('ref')
    ]);

    $refNumber = $request->query('ref');

    if (!$refNumber) {
        Log::warning("No ref number provided in paymentSuccess");
        return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');
    }

    $order = FoodOrderModel::where('ref_number', $refNumber)->first();

    if (!$order) {
        Log::warning("Order not found for ref: {$refNumber}");
        return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');
    }

    // Mark payment as paid
    $order->update(['payment_status' => 'Paid', 'order_status' => 'Pending']);

    // Map: food display name => property on order
    $orderedItems = [
        'Smoked Fish'   => $order->smokedFish_order,
        'Deviled Fish'  => $order->deviledFish_order,
        'Sea Sig'       => $order->seaSig_order,
        'Blue Craze'    => $order->blueCraze_order,
        'Chicken Sheet' => $order->chickenSheet_order,
        'Black Meal'    => $order->blackMeal_order,
    ];

    DB::transaction(function () use ($orderedItems, $refNumber) {

        foreach ($orderedItems as $foodName => $qtyOrdered) {
            // ensure numeric qty
            $qtyOrdered = is_numeric($qtyOrdered) ? (float) $qtyOrdered : 0;
            if ($qtyOrdered <= 0) continue;

            Log::info("ORDERED ITEMS DUMP", $orderedItems);

            $normalized = trim(mb_strtolower($foodName));

            // robust product lookup: try exact then fallback to case-insensitive/trimmed
            $foodProduct = FoodProduct::whereRaw('LOWER(TRIM(productName)) = ?', [$normalized])->first();

            if (!$foodProduct) {
                // Last-ditch: try a LIKE match in case of extra words/punctuation
                $foodProduct = FoodProduct::where('productName', 'like', '%' . $foodName . '%')->first();
            }

            if (!$foodProduct) {
                Log::warning("⚠️ Food product not found for ordered item '{$foodName}' (normalized '{$normalized}') — ref {$refNumber}");
                continue;
            }

            Log::info("Found product '{$foodProduct->productName}' (id={$foodProduct->id}) for ordered item '{$foodName}', qtyOrdered={$qtyOrdered}");

            // Use relation or explicit model to get ingredient rows
            $ingredients = $foodProduct->ingredientsDetails()->get();

            if ($ingredients->isEmpty()) {
                Log::warning("⚠️ No ingredients defined for food_product_id={$foodProduct->id} ({$foodProduct->productName})");
                continue;
            }

            foreach ($ingredients as $ingredientRow) {
                // ensure numeric quantity_used
                $quantityUsed = is_numeric($ingredientRow->quantity_used) ? (float) $ingredientRow->quantity_used : 0;
                if ($quantityUsed <= 0) {
                    Log::warning("⚠️ Non-positive quantity_used for food_ingredient id={$ingredientRow->id}, food_product_id={$foodProduct->id}");
                    continue;
                }

                $deductAmount = $quantityUsed * $qtyOrdered;

                // Prefer relationship to load the KitchenInventory model if set up
                $inventory = null;
                if (method_exists($ingredientRow, 'ingredient')) {
                    $inventory = $ingredientRow->ingredient()->lockForUpdate()->first();
                }

                // fallback to direct find (locks as well)
                if (!$inventory) {
                    $inventory = KitchenInventory::where('id', $ingredientRow->ingredient_id)->lockForUpdate()->first();
                }

                if ($inventory) {
                    // ensure numeric current_stock
                    $current = is_numeric($inventory->current_stock) ? (float) $inventory->current_stock : 0;
                    $newStock = max(0, $current - $deductAmount);

                    $inventory->current_stock = $newStock;
                    $inventory->save();

                    Log::info("🧾 Deducted {$deductAmount} {$inventory->unit} from {$inventory->item_name} (id={$inventory->id}). Previous: {$current}, New: {$newStock}");
                } else {
                    Log::warning("⚠️ Ingredient ID {$ingredientRow->ingredient_id} for food_product_id={$foodProduct->id} not found in kitchen_inventory (ref {$refNumber})");
                }
            }
        }
    });

    Log::info("✅ Payment successful and (attempted) inventory updates for {$refNumber}");
    return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentSuccess.html');
}




    // Step 2b: If payment fails
    public function paymentFailed(Request $request)
    {
      Log::info("❌ paymentFailed route hit", [
        'full_url' => $request->fullUrl(),
        'ref' => $request->query('ref'),
    ]);

    $refNumber = $request->query('ref');

    if ($refNumber) {
        $updated = FoodOrderModel::where('ref_number', $refNumber)
            ->update([
                'payment_status' => 'Failed',
                'order_status' => 'Cancelled'
            ]);

        Log::info("❌ Payment marked as failed for ref: {$refNumber}, updated rows: {$updated}");
    } else {
        Log::warning('⚠️ No ref number in paymentFailed redirect.');
    }

    return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');
    
    }

     public function index()
    {
       
    return response()->json(FoodOrderModel::orderBy('created_at', 'desc')->get());
    }
}
