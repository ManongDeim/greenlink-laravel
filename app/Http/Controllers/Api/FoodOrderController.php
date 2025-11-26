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
use App\Http\Controllers\Api\RoomModel;
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
    $ref = $request->query('ref');
    Log::info('Payment redirect hit', ['ref' => $ref, 'full_url' => $request->fullUrl()]);

    $reservation = DB::where('ref_number', $ref)->first();
    if (!$reservation) {
        Log::warning("Reservation not found for ref: {$ref}");
        return redirect()->away($request->getSchemeAndHttpHost() . '/pages/paymentFailed.html');
    }

    // Mark as Paid on redirect (best-effort)
    $statusMap = ['Down Payment' => 'Down Paid', 'Full Payment' => 'Paid'];
    $paymentStatus = $statusMap[$reservation->payment_method] ?? 'Paid';
    $reservation->update(['payment_status' => $paymentStatus]);

    Log::info('Reservation marked payment status (redirect)', [
        'reservation' => $reservation->room_reser_id,
        'payment_status' => $paymentStatus
    ]);

    // ------------------------------
    //  SEND EMAILS USING HOSTINGER SMTP
    // ------------------------------
    try {
        // Admin emails
        $adminEmails = ["deimdgreat@gmail.com", "x3qe2w1@gmail.com"];
        $subjectAdmin = "New Reservation Paid: {$reservation->room_reser_id}";

        $adminMessage = "A customer has successfully paid for a reservation.\n\n" .
                        "Reservation ID: {$reservation->room_reser_id}\n" .
                        "Name: {$reservation->full_name}\n" .
                        "Room: {$reservation->room}\n" .
                        "Total Paid: PHP {$reservation->total_bill}\n" .
                        "Email: {$reservation->email}\n" .
                        "Phone: {$reservation->phone_number}\n";

        foreach ($adminEmails as $email) {
            Mail::raw($adminMessage, function ($message) use ($email, $subjectAdmin) {
                $message->to($email)
                        ->subject($subjectAdmin);
            });
        }

        Log::info("📧 Admin emails sent via Hostinger SMTP", ["to" => $adminEmails]);

        // Customer email
        $customerMessage = "Hello {$reservation->full_name},\n\n" .
                           "Your payment for the room '{$reservation->room}' has been successfully received.\n" .
                           "Reservation ID: {$reservation->room_reser_id}\n" .
                           "Total Paid: PHP {$reservation->total_bill}\n\n" .
                           "Thank you for choosing us!";

        Mail::raw($customerMessage, function ($message) use ($reservation) {
            $message->to($reservation->email)
                    ->subject("Payment Completed for Reservation {$reservation->room_reser_id}");
        });

        Log::info("📧 User email sent via Hostinger SMTP", ["to" => $reservation->email]);

    } catch (\Exception $e) {
        Log::error("❌ Failed to send email via Hostinger SMTP: " . $e->getMessage());
    }

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
