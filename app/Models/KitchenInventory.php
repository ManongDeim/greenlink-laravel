<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KitchenInventory extends Model
{
    protected $fillable = [
        'item_name',
        'min_stock',
        'current_stock',
        'unit',
        'weekly_demand',
        'ordering_cost',
        'holding_cost',
        'eoq',
        'status',
        'last_updated'
    ];

    public $timestamps = false;

    protected static function booted()
    {
        static::saving(function ($item) {
            // Compute EOQ if fields are available
            if ($item->weekly_demand && $item->ordering_cost && $item->holding_cost) {
                $annual_demand = $item->weekly_demand * 52;
                $item->eoq = sqrt((2 * $annual_demand * $item->ordering_cost) / $item->holding_cost);
            }

            // Stock status logic (based on % of min_stock)
            $ratio = ($item->current_stock / $item->min_stock) * 100;

            if ($ratio <= 29) {
                $item->status = 'Restock Needed';
            } elseif ($ratio <= 39) {
                $item->status = 'Low Stock';
            } else {
                $item->status = 'Good';
            }

            $item->last_updated = now();
        });
    }
}
