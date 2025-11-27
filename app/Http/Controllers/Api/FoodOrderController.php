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
use Illuminate\Support\Facades\Mail;

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
                'scheduled_datetime' => $request->input('scheduled_datetime'),
                'order_type' => $request->input('order_type'),
                'notes' => $request->input('notes'),
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

    // ORDERED ITEMS
    $orderedItems = [
        'Smoked Fish'   => $order->smokedFish_order,
        'Deviled Fish'  => $order->deviledFish_order,
        'Sea Sig'       => $order->seaSig_order,
        'Blue Craze'    => $order->blueCraze_order,
        'Chicken Sheet' => $order->chickenSheet_order,
        'Black Meal'    => $order->blackMeal_order,
    ];

    Log::info("ORDERED ITEMS DUMP", $orderedItems);

    // ------------------------------
    //  SEND EMAILS
    // ------------------------------
    try {
        // 1️⃣ Admin emails
        $adminEmails = [
            "greenlinklolasayong@gmail.com",
            "deimdgreat@gmail.com",
        ];

        $subjectAdmin = "New Food Order Payment – Ref {$order->ref_number}";
        $messageBody = "A customer has successfully paid for a food order.\n\n" .
                       "Reference Number: {$order->ref_number}\n" .
                       "Order ID: {$order->foodOrder_id}\n" .
                       "Order Type: " . ucfirst($order->order_type) . "\n" .
                       "Schedule: " . $order->scheduled_datetime . "\n" .
                       "Notes: " . ($order->notes ?? 'None') . "\n\n" .
                       "Total Amount: ₱" . number_format($order->total_bill, 2) . "\n\n" .
                       "Ordered Items:\n";

        foreach ($orderedItems as $name => $qty) {
            if ($qty > 0) {
                $messageBody .= "- {$name}: {$qty}\n";
            }
        }

        Log::info("📧 Sending admin emails...", ['emails' => $adminEmails]);

        foreach ($adminEmails as $email) {
            Mail::raw($messageBody, function ($message) use ($email, $subjectAdmin) {
                $message->to($email)
                        ->subject($subjectAdmin);
            });
        }

        // 2️⃣ Customer email
        if ($order->user_id) {
            $user = $order->user; // assumes FoodOrderModel has 'user' relationship
            if ($user && $user->email) {
                $customerEmail = $user->email;
                $subjectCustomer = "Your Food Order Payment – Ref {$order->ref_number}";
                $customerMessage = "Hello {$user->name},\n\n" .
                                   "Thank you for your payment! Here are your order details:\n\n" .
                                   "Reference Number: {$order->ref_number}\n" .
                                   "Order ID: {$order->foodOrder_id}\n" .
                                   "Order Type: " . ucfirst($order->order_type) . "\n" .
                                   "Schedule: " . $order->scheduled_datetime . "\n" .
                                   "Notes: " . ($order->notes ?? 'None') . "\n\n" .
                                   "Total Amount: ₱" . number_format($order->total_bill, 2) . "\n\n" .
                                   "Ordered Items:\n";

                foreach ($orderedItems as $name => $qty) {
                    if ($qty > 0) {
                        $customerMessage .= "- {$name}: {$qty}\n";
                    }
                }

                Mail::raw($customerMessage, function ($message) use ($customerEmail, $subjectCustomer) {
                    $message->to($customerEmail)
                            ->subject($subjectCustomer);
                });

                Log::info("📧 Customer email sent to {$customerEmail}");
            }
        }

    } catch (\Exception $e) {
        Log::error("❌ Failed to send email: " . $e->getMessage());
    }

    // ------------------------------
    //  INVENTORY DEDUCTION
    // ------------------------------
    DB::transaction(function () use ($orderedItems, $refNumber) {
        foreach ($orderedItems as $foodName => $qtyOrdered) {
            $qtyOrdered = is_numeric($qtyOrdered) ? (float) $qtyOrdered : 0;
            if ($qtyOrdered <= 0) continue;

            $normalized = trim(mb_strtolower($foodName));

            $foodProduct = FoodProduct::whereRaw('LOWER(TRIM(productName)) = ?', [$normalized])->first();

            if (!$foodProduct) {
                $foodProduct = FoodProduct::where('productName', 'like', '%' . $foodName . '%')->first();
            }

            if (!$foodProduct) {
                Log::warning("⚠️ Food product not found for '{$foodName}' — ref {$refNumber}");
                continue;
            }

            $ingredients = $foodProduct->ingredientsDetails()->get();

            if ($ingredients->isEmpty()) {
                Log::warning("⚠️ No ingredients for product_id={$foodProduct->id}");
                continue;
            }

            foreach ($ingredients as $ingredientRow) {
                $quantityUsed = is_numeric($ingredientRow->quantity_used) ? (float) $ingredientRow->quantity_used : 0;
                if ($quantityUsed <= 0) continue;

                $deductAmount = $quantityUsed * $qtyOrdered;

                $inventory = KitchenInventory::where('id', $ingredientRow->ingredient_id)->lockForUpdate()->first();

                if ($inventory) {
                    $current = is_numeric($inventory->current_stock) ? (float) $inventory->current_stock : 0;
                    $inventory->current_stock = max(0, $current - $deductAmount);
                    $inventory->save();

                    Log::info("🧾 Deducted {$deductAmount} {$inventory->unit} from {$inventory->item_name}");
                } else {
                    Log::warning("⚠️ Ingredient not found in inventory (ID {$ingredientRow->ingredient_id})");
                }
            }
        }
    });

    Log::info("✅ Payment success processing completed for {$refNumber}");

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

    public function delete($foodOrderId)
{
    $order = FoodOrderModel::where('foodOrder_id', $foodOrderId)->first();
    if (!$order) {
        return response()->json(['success' => false, 'message' => 'Order not found'], 404);
    }

    $order->delete();
    return response()->json(['success' => true, 'message' => 'Order deleted successfully']);
}

}
