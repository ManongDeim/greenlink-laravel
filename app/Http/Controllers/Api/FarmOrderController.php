<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\FarmOrderModel;
use App\Http\Controllers\Controller;


class FarmOrderController extends Controller
{       

   private function getCloudflareDomain()
{
    return env('CLOUDFLARE_URL', config('app.url'));
}


 public function createPaymentLink(Request $request)
    {
        Log::info('Incoming request:', $request->all());

        $refNumber = uniqid('REF-');

        // Convert cart into orderData
        $orderData = [
            'bangus_order' => 0,
            'eggs_order' => 0,
            'mudCrab_order' => 0,
            'nativeChicken_order' => 0,
            'nativePork_order' => 0,
            'squash_order' => 0,
            'total_bill' => 0,
            'payment_method' => 'GCash',
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

        // Save order to DB
        FarmOrderModel::create($orderData);

         // Detect Cloudflare tunnel dynamically
        $publicUrl = $this->getCloudflareDomain();

        // Call PayMongo API
        $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
            ->post('https://api.paymongo.com/v1/checkout_sessions', [
                'data' => [
                    'attributes' => [
                        'line_items' => $lineitems, 
                        'payment_method_types' => ['gcash'],
                        'amount' => intval($orderData['total_bill'] * 100), // centavos
                        'description' => "Farm Order Ref: $refNumber",
                        'remarks' => $refNumber,
                        'currency' => 'PHP',
                        'show_line_items' => true,
                        'show_description' => true,
                        'success_url' =>  $publicUrl . '/farmOrders/payment-success?remarks=' . $refNumber,
                        'cancel_url' =>  $publicUrl . '/farmOrders/payment-failed?remarks=' . $refNumber,
                    ]
                ]
            ]);

        $checkoutUrl = $response->json()['data']['attributes']['checkout_url'] ?? null;

        Log::info('PayMongo response', $response->json());

        return response()->json([
    'payment_url' => $checkoutUrl
]);
    }

    public function paymentSuccess(Request $request)
    {

  Log::info("✅ paymentSuccess route hit", [
        'full_url' => $request->fullUrl(),
        'ref' => $request->query('remarks')
    ]);

        $refNumber = $request->query('remarks');
        $order = FarmOrderModel::where('ref_number', $refNumber)->first();

        if (!$order) {
             return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');
        }

        

        $order->update(['order_status' => 'Paid']);
        Log::info("PaymentSuccess hit", $request->all());
        return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentSuccess.html');
        
    }

    // Step 2b: If payment fails
    public function paymentFailed(Request $request)
    {
        $refNumber = $request->query('remarks');

        // Optional: update DB if needed
        if ($refNumber) {
            FarmOrderModel::where('ref_number', $refNumber)
                ->update(['order_status' => 'Failed']);
        }

        return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentSuccess.html');
    }
    
}
