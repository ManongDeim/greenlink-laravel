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
        'user_id',
        'foodOrder_id',
        'smokedFish_order',
        'deviledFish_order',
        'seaSig_order',
        'blueCraze_order',
        'chickenSheet_order',
        'blackMeal_order',
        'total_bill',
        'payment_method',
        'payment_status',
        'order_status',
        'ref_number'
    ];

      public function user() {
    return $this->belongsTo(User::class, 'user_id', 'id');
}
}
