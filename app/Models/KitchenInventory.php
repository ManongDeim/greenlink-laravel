<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KitchenInventory extends Model
{
    use HasFactory;

    protected $table = 'kitchen_inventory';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'item_name',
        'min_stock',
        'current_stock',
        'unit',
        'unit_cost',
        'status',
        'last_updated',
        'weekly_demand',
        'ordering_cost',
        'holding_cost',
        'eoq',
    ];

    protected static function booted()
    {
        static::saving(function ($item) {
            // --- Compute Status ---
            $percentage = ($item->min_stock > 0)
                ? ($item->current_stock / $item->min_stock) * 100
                : 0;

            if ($percentage >= 40) {
                $item->status = 'Good';
            } elseif ($percentage >= 30) {
                $item->status = 'Low Stock';
            } else {
                $item->status = 'Restock Needed';
            }

            // --- Preset carrying rate (30% annual) ---
            $annualCarryingRate = 0.3;

            // --- Auto compute holding cost (weekly) ---
            if ($item->unit_cost) {
                $item->holding_cost = ($item->unit_cost * $annualCarryingRate) / 52;
            }

            // --- Compute EOQ (weekly) ---
            if ($item->weekly_demand && $item->ordering_cost && $item->holding_cost > 0) {
                $item->eoq = round(sqrt((2 * $item->weekly_demand * $item->ordering_cost) / $item->holding_cost), 2);
            }

            // --- Update timestamp ---
            $item->last_updated = now();
        });
    }

    public function foods()
{
    return $this->belongsToMany(FoodProduct::class, 'food_ingredients', 'ingredient_id', 'food_product_id')
                ->withPivot('quantity_used');
}

}
