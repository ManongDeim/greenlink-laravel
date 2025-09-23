<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\FoodOrderModel;

class FoodOrderController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Incoming request:', $request->all());

        // Initialize all product columns to 0
        $orderData = [
            'smokedFish_order' => 0,
            'deviledFish_order' => 0,
            'seaSig_order' => 0,
            'blueCraze_order' => 0,
            'chickenSheet_order' => 0,
            'blackMeal_order' => 0,
            'total_bill' => 0,
            'payment_method' => $request->payment_method,
            'order_status' => 'Pending',
        ];

        // Loop through cart items
        foreach ($request->cart as $item) {
            switch ($item['name']) {
                case 'Smoked Fish':
                    $orderData['smokedFish_order'] = $item['qty'];
                    break;
                case 'Deviled Fish':
                    $orderData['deviledFish_order'] = $item['qty'];
                    break;
                case 'SeaSig':
                    $orderData['seaSig_order'] = $item['qty'];
                    break;
                case 'Blue Craze':
                    $orderData['blueCraze_order'] = $item['qty'];
                    break;
                case 'Chicken Sheet':
                    $orderData['chickenSheet_order'] = $item['qty'];
                    break;
                case 'Black Meal':
                    $orderData['blackMeal_order'] = $item['qty'];
                    break;
            }

            // Add to total bill
            $orderData['total_bill'] += $item['price'] * $item['qty'];
        }

        // Save to DB
        FoodOrderModel::create($orderData);

        return response()->json(['message' => 'Order saved successfully!']);
    }
}
