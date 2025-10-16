<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\FarmOrderModel;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class FarmOrderController extends Controller
{       


     public function createPaymentLink(Request $request)
    {
        Log::info('Incoming request:', $request->all());

        // ✅ Get authenticated user automatically
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized. Please log in first.'], 401);
        }

        // Wrap everything in a transaction to prevent race conditions
        $order = DB::transaction(function () use ($request, $user) {

            // Generate unique FARM order ID (safe under concurrency)
            do {
                $farmOrderId = 'FARM-'. mt_rand(1,99999);
            } while (FarmOrderModel::where('farmOrder_id', $farmOrderId)->exists());

            // Generate unique reference number for PayMongo
            $refNumber = uniqid('REF-');

            // Prepare initial order data
            $orderData = [
                'farmOrder_id' => $farmOrderId,
                'user_id' => $user->id, // ✅ taken automatically from logged-in user
                'bangus_order' => 0,
                'eggs_order' => 0,
                'mudCrab_order' => 0,
                'nativeChicken_order' => 0,
                'nativePork_order' => 0,
                'squash_order' => 0,
                'total_bill' => 0,
                'payment_method' => 'GCash',
                'payment_status' => 'Pending',
                'order_status' => 'Pending',
                'ref_number' => $refNumber,
            ];

            $lineitems = [];

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
            return FarmOrderModel::create($orderData);
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
                        'description' => "Farm Order Ref: {$order->ref_number}",
                        'remarks' => $order->ref_number,
                        'currency' => 'PHP',
                        'show_line_items' => true,
                        'show_description' => true,
                        'success_url' => 'https://greenlinklolasayong.site/api/paymentSuccess?ref=' . $order->ref_number,
                        'cancel_url' => 'https://greenlinklolasayong.site/api/paymentFailed?ref=' . $order->ref_number,
                    ]
                ]
            ]);

        $checkoutUrl = $response->json()['data']['attributes']['checkout_url'] ?? null;

        Log::info('PayMongo response', $response->json());

        return response()->json([
            'payment_url' => $checkoutUrl,
            'farmrOder_id' => $order->farmOrder_id,
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

        if(!$refNumber) {
            Log::warning("No ref number provided in paymentSuccess");
            return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');
        }

        $order = FarmOrderModel::where('ref_number', $refNumber)->first();

        if (!$order) {
             return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');
        }

        

        $order->update(['payment_status' => 'Paid']);
        Log::info("Payment marked successful with reference number: {$refNumber}");
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
        $updated = FarmOrderModel::where('ref_number', $refNumber)
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
        return response()->json(FarmOrderModel::all());
    }
}