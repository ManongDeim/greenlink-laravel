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

        // 1. Save Order to Database
        $order = DB::transaction(function () use ($request, $user, $hasDiscount) {
            do {
                $foodOrderId = 'FOOD-' . mt_rand(1, 99999);
            } while (FoodOrderModel::where('foodOrder_id', $foodOrderId)->exists());

            $refNumber = uniqid('REF-');

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
                'payment_method' => $request->payment_method, // 'Cash' or 'PayMongo'
                'payment_status' => 'Pending', // Default to Pending
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
                if ($hasDiscount) $subtotal *= 0.8;
                $orderData['total_bill'] += $subtotal;
            }

            return FoodOrderModel::create($orderData);
        });

        // 2. Logic Branch: Cash vs PayMongo
        if ($request->payment_method === 'Cash') {
            // For Cash: Process emails and inventory IMMEDIATELY
            // because there is no callback later.
            $this->processOrderFulfillment($order);

            return response()->json([
                'success' => true,
                'message' => 'Cash order placed successfully',
                'foodOrder_id' => $order->foodOrder_id,
                'ref_number' => $order->ref_number,
                'total_bill' => $order->total_bill
            ]);
        } 
        else {
            // For PayMongo: Call API
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

            return response()->json([
                'payment_url' => $checkoutUrl,
                'foodOder_id' => $order->foodOrder_id,
                'ref_number' => $order->ref_number,
                'hasDiscount' => $hasDiscount,
                'total_bill' => $order->total_bill
            ]);
        }
    }

    public function paymentSuccess(Request $request)
    {
        $refNumber = $request->query('ref');
        if (!$refNumber) return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');

        $order = FoodOrderModel::where('ref_number', $refNumber)->first();
        if (!$order) return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');

        // Mark as Paid
        $order->update(['payment_status' => 'Paid', 'order_status' => 'Pending']);

        // Process Email and Inventory
        $this->processOrderFulfillment($order);

        return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentSuccess.html');
    }

    // --- Private Helper to handle Inventory & Emails (Used by both Cash and PayMongo) ---
    private function processOrderFulfillment($order)
    {
        // 1. Identify Ordered Items
        $orderedItems = [
            'Smoked Fish'   => $order->smokedFish_order,
            'Deviled Fish'  => $order->deviledFish_order,
            'Sea Sig'       => $order->seaSig_order,
            'Blue Craze'    => $order->blueCraze_order,
            'Chicken Sheet' => $order->chickenSheet_order,
            'Black Meal'    => $order->blackMeal_order,
        ];

        // 2. Send Emails
        try {
            $adminEmails = ["greenlinklolasayong@gmail.com", "deimdgreat@gmail.com"];
            $subjectAdmin = "New Food Order ({$order->payment_method}) – Ref {$order->ref_number}";
            
            $messageBody = "A new order has been placed.\n\n" .
                           "Reference Number: {$order->ref_number}\n" .
                           "Order ID: {$order->foodOrder_id}\n" .
                           "Payment Method: {$order->payment_method}\n" .
                           "Payment Status: {$order->payment_status}\n" .
                           "Order Type: " . ucfirst($order->order_type) . "\n" .
                           "Schedule: " . $order->scheduled_datetime . "\n" .
                           "Notes: " . ($order->notes ?? 'None') . "\n\n" .
                           "Total Amount: ₱" . number_format($order->total_bill, 2) . "\n\n" .
                           "Ordered Items:\n";

            foreach ($orderedItems as $name => $qty) {
                if ($qty > 0) $messageBody .= "- {$name}: {$qty}\n";
            }

            foreach ($adminEmails as $email) {
                Mail::raw($messageBody, function ($message) use ($email, $subjectAdmin) {
                    $message->to($email)->subject($subjectAdmin);
                });
            }

            // Customer Email
            if ($order->user_id) {
                $user = $order->user;
                if ($user && $user->email) {
                    Mail::raw("Hello {$user->name},\n\nYour order has been received!\n\n" . $messageBody, function ($message) use ($user, $order) {
                        $message->to($user->email)->subject("Your Food Order – Ref {$order->ref_number}");
                    });
                }
            }
        } catch (\Exception $e) {
            Log::error("❌ Failed to send email: " . $e->getMessage());
        }

        // 3. Deduct Inventory
        DB::transaction(function () use ($orderedItems, $order) {
            foreach ($orderedItems as $foodName => $qtyOrdered) {
                $qtyOrdered = is_numeric($qtyOrdered) ? (float) $qtyOrdered : 0;
                if ($qtyOrdered <= 0) continue;

                $normalized = trim(mb_strtolower($foodName));
                $foodProduct = FoodProduct::whereRaw('LOWER(TRIM(productName)) = ?', [$normalized])->first();
                if (!$foodProduct) $foodProduct = FoodProduct::where('productName', 'like', '%' . $foodName . '%')->first();

                if ($foodProduct) {
                    $ingredients = $foodProduct->ingredientsDetails()->get();
                    foreach ($ingredients as $ing) {
                        $used = (float) $ing->quantity_used;
                        if ($used > 0) {
                            $inv = KitchenInventory::where('id', $ing->ingredient_id)->lockForUpdate()->first();
                            if ($inv) {
                                $inv->current_stock = max(0, ((float)$inv->current_stock) - ($used * $qtyOrdered));
                                $inv->save();
                            }
                        }
                    }
                }
            }
        });
        
        Log::info("✅ Order Fulfillment completed for {$order->ref_number}");
    }

    public function paymentFailed(Request $request)
    {
        $refNumber = $request->query('ref');
        if ($refNumber) {
            FoodOrderModel::where('ref_number', $refNumber)->update(['payment_status' => 'Failed', 'order_status' => 'Cancelled']);
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
        if (!$order) return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        $order->delete();
        return response()->json(['success' => true, 'message' => 'Order deleted successfully']);
    }
}