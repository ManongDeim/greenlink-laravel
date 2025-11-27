<?php

namespace App\Http\Controllers\Api;

use App\Helpers\GlobalMailHelper;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\FarmOrderModel;
use App\Models\FarmProduct;
use App\Models\FarmInventory;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Models\GoogleUser;

class FarmOrderController extends Controller
{
    public function createPaymentLink(Request $request)
    {
        Log::info('Incoming request:', $request->all());

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized. Please log in first.'], 401);
        }

        $googleUser = GoogleUser::where('user_id', $user->id)->first();
        $hasDiscount = $googleUser && $googleUser->id_status === 'Validated';

        // 1. Save to Database
        $order = DB::transaction(function () use ($request, $user, $hasDiscount) {
            do {
                $farmOrderId = 'FARM-' . mt_rand(1, 99999);
            } while (FarmOrderModel::where('farmOrder_id', $farmOrderId)->exists());

            $refNumber = uniqid('REF-');

            $orderData = [
                'farmOrder_id' => $farmOrderId,
                'user_id' => $user->id,
                'bangus_order' => 0,
                'eggs_order' => 0,
                'mudCrab_order' => 0,
                'nativeChicken_order' => 0,
                'nativePork_order' => 0,
                'squash_order' => 0,
                'total_bill' => 0,
                'payment_method' => $request->payment_method, // 'Cash' or 'GCash'
                'payment_status' => 'Pending',
                'order_status' => 'Pending',
                'ref_number' => $refNumber,
                'scheduled_datetime' => $request->input('scheduled_datetime'),
            ];

            foreach ($request->cart as $item) {
                switch ($item['name']) {
                    case 'Bangus': $orderData['bangus_order'] = $item['qty']; break;
                    case 'Egg': $orderData['eggs_order'] = $item['qty']; break;
                    case 'Mud Crab': $orderData['mudCrab_order'] = $item['qty']; break;
                    case 'Native Chicken': $orderData['nativeChicken_order'] = $item['qty']; break;
                    case 'Native Pork': $orderData['nativePork_order'] = $item['qty']; break;
                    case 'Squash': $orderData['squash_order'] = $item['qty']; break;
                }
                $subtotal = $item['price'] * $item['qty'];
                if ($hasDiscount) $subtotal *= 0.8;
                $orderData['total_bill'] += $subtotal;
            }

            return FarmOrderModel::create($orderData);
        });

        // 2. Logic Branch: Cash vs PayMongo
        if ($request->payment_method === 'Cash') {
            // For Cash: Process immediately
            $this->processOrderFulfillment($order);

            return response()->json([
                'success' => true,
                'message' => 'Cash order placed successfully',
                'farmOrder_id' => $order->farmOrder_id,
                'ref_number' => $order->ref_number,
                'total_bill' => $order->total_bill
            ]);
        } 
        else {
            // For PayMongo
            $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
                ->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'line_items' => array_map(function ($item) use ($hasDiscount) {
                                $price = $item['price'];
                                if ($hasDiscount) $price *= 0.8;
                                return [
                                    'currency' => 'PHP',
                                    'amount' => intval($price * 100),
                                    'name' => $item['name'],
                                    'quantity' => $item['qty'],
                                ];
                            }, $request->cart),
                            'payment_method_types' => ['gcash'],
                            'amount' => intval($order->total_bill * 100),
                            'description' => "Farm Order Ref: {$order->ref_number}",
                            'remarks' => $order->ref_number,
                            'currency' => 'PHP',
                            'success_url' => 'https://greenlinklolasayong.site/api/paymentSuccessFarm?ref=' . $order->ref_number,
                            'cancel_url' => 'https://greenlinklolasayong.site/api/paymentFailedFarm?ref=' . $order->ref_number,
                        ]
                    ]
                ]);

            $checkoutUrl = $response->json()['data']['attributes']['checkout_url'] ?? null;

            return response()->json([
                'payment_url' => $checkoutUrl,
                'farmOder_id' => $order->farmOrder_id,
                'hasDiscount' => $hasDiscount,
                'ref_number' => $order->ref_number
            ]);
        }
    }

    public function paymentSuccess(Request $request)
    {
        $refNumber = $request->query('ref');
        if (!$refNumber) return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');

        $order = FarmOrderModel::where('ref_number', $refNumber)->first();
        if (!$order) return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');

        if ($order->payment_status !== 'Paid') {
            $order->update(['payment_status' => 'Paid', 'order_status' => 'Pending']);
            $this->processOrderFulfillment($order); // Reuse logic
        }

        return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentSuccess.html');
    }

    // --- Private Helper to handle Inventory & Emails (Shared) ---
    private function processOrderFulfillment($order)
    {
        // 1. Map columns to product names
        $productFields = [
            'Bangus' => 'bangus_order',
            'Egg' => 'eggs_order',
            'Mud Crab' => 'mudCrab_order',
            'Native Chicken' => 'nativeChicken_order',
            'Native Pork' => 'nativePork_order',
            'Squash' => 'squash_order',
        ];

        $orderedItems = [];

        // 2. Deduct Inventory
        foreach ($productFields as $productName => $field) {
            $orderedQty = $order->$field ?? 0;
            if ($orderedQty > 0) {
                $product = FarmInventory::where('item_name', $productName)->first();
                if ($product) {
                    $conversion = $product->unit_conversion ?? 1;
                    $deductQty = $orderedQty * $conversion;
                    $newQty = max(0, $product->current_stock - $deductQty);
                    $product->update(['current_stock' => $newQty]);
                }
                $orderedItems[$productName] = $orderedQty;
            }
        }

        // 3. Send Emails
        try {
            $adminEmails = ["greenlinklolasayong@gmail.com", "deimdgreat@gmail.com"];
            $subjectAdmin = "New Farm Order ({$order->payment_method}) – {$order->ref_number}";
            
            $emailBody = "<p>Reference Number: {$order->ref_number}</p>";
            $emailBody .= "<p>Payment Method: {$order->payment_method} ({$order->payment_status})</p>";
            $emailBody .= "<p><strong>Scheduled Pickup: " . date('F j, Y g:i A', strtotime($order->scheduled_datetime)) . "</strong></p>";
            $emailBody .= "<ul>";
            foreach ($orderedItems as $name => $qty) {
                $emailBody .= "<li>{$name}: {$qty}</li>";
            }
            $emailBody .= "<p>Total Bill: PHP " . number_format($order->total_bill, 2) . "</p></ul>";

            foreach ($adminEmails as $email) {
                Mail::html($emailBody, function ($message) use ($email, $subjectAdmin) {
                    $message->to($email)->subject($subjectAdmin);
                });
            }

            if ($order->user && $order->user->email) {
                $customerEmail = $order->user->email;
                Mail::html($emailBody, function ($message) use ($customerEmail, $order) {
                    $message->to($customerEmail)->subject("Farm Order Confirmation – {$order->ref_number}");
                });
            }
        } catch (\Exception $e) {
            Log::error("❌ Failed to send email: " . $e->getMessage());
        }
        
        Log::info("✅ Order fulfillment completed for {$order->ref_number}");
    }

    public function paymentFailed(Request $request)
    {
        $refNumber = $request->query('ref');
        if ($refNumber) {
            FarmOrderModel::where('ref_number', $refNumber)->update(['payment_status' => 'Failed', 'order_status' => 'Cancelled']);
        }
        return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');
    }

    public function index()
    {
        return response()->json(FarmOrderModel::all());
    }

    public function updateStatus(Request $request, $farmOrderId)
    {
        $status = $request->input('order_status');
        if (!in_array($status, ['Pending', 'Completed', 'Cancelled'])) {
            return response()->json(['error' => 'Invalid status'], 400);
        }
        $order = FarmOrderModel::where('farmOrder_id', $farmOrderId)->first();
        if (!$order) return response()->json(['error' => 'Order not found'], 404);
        $order->order_status = $status;
        $order->save();
        return response()->json(['message' => "Order updated", 'order' => $order]);
    }

    public function deleteFarmOrder($id)
    {
        $order = FarmOrderModel::where('farmOrder_id', $id)->first();
        if (!$order) return response()->json(['message' => 'Farm order not found'], 404);
        $order->delete();
        return response()->json(['message' => 'Farm order removed successfully'], 200);
    }
}