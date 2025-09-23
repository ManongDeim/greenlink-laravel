<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodOrderModel extends Model
{
    use HasFactory;

    protected $table = 'food_orders';

    public $timestamps = false;

    protected $fillable = [
        'smokedFish_order',
        'deviledFish_order',
        'seaSig_order',
        'blueCraze_order',
        'chickenSheet_order',
        'blackMeal_order',
        'total_bill',
        'payment_method',
        'order_status'
    ];
}
