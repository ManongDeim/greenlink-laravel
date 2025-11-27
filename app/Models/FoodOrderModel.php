<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodOrderModel extends Model
{
    use HasFactory;

    protected $table = 'food_orders';

    public $timestamps = true;

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
        'ref_number',
        'scheduled_datetime',
        'order_type',
        'notes'
    ];

      public function user() {
    return $this->belongsTo(User::class, 'user_id', 'id');
}
}
