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
        'productName',
        'productPicture',
        'qty',
        'price',
    ];

    public function ingredients()
{
    return $this->belongsToMany(
        KitchenInventory::class,
        'food_ingredients',
        'food_product_id',
        'ingredient_id'
    )->withPivot('quantity_used');
}


public function ingredientsDetails()
{
    return $this->hasMany(FoodIngredient::class, 'food_product_id');
}

}
