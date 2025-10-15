<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodProduct extends Model
{
    use HasFactory;

    protected $table = 'food_products';

    public $timestamps = false;

    protected $fillable = [
        'foodProduct_id',
        'productName',
        'productPicture',
        'qty',
        'price',
    ];
}
