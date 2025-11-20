<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodIngredient extends Model
{
    use HasFactory;

    protected $table = 'food_ingredients';
    public $timestamps = false;

    protected $fillable = [
        'food_product_id',
        'ingredient_id',
        'quantity_used',
    ];

     public function foodProduct()
    {
        return $this->belongsTo(FoodProduct::class);
    }

    public function ingredient()
    {
        return $this->belongsTo(KitchenInventory::class, 'ingredient_id');
    }
}
