<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FarmOrderModel extends Model
{
     use HasFactory;

    protected $table = 'farm_orders';

    public $timestamps = false;

    protected $fillable = [
        'bangus_order',
        'eggs_order',
        'mudCrab_order',
        'nativeChicken_order',
        'nativePork_order',
        'squash_order',
        'total_bill',
        'payment_method',
        'order_status',
        'ref_number'
    ];
}
