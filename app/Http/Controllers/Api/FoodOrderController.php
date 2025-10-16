<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\FoodOrderModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
                        'success_url' => 'https://greenlinklolasayong.site/api/paymentSuccess?ref=' . $order->ref_number,
                        'cancel_url' => 'https://greenlinklolasayong.site/api/paymentFailed?ref=' . $order->ref_number,
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

        if(!$refNumber) {
            Log::warning("No ref number provided in paymentSuccess");
            return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');
        }

        $order = FoodOrderModel::where('ref_number', $refNumber)->first();

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
        return response()->json(FoodOrderModel::all());
    }
}
