<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FarmProduct extends Model
{
    use HasFactory;

    protected $table = 'farm_products';

    public $timestamps = false;

    protected $fillable = [
        'farmProduct_id',
        'productName',
        'productPicture',
        'qty',
        'price',
    ];
}
