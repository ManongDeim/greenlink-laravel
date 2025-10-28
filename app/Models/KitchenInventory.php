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

            // --- Compute EOQ (only if all needed fields are filled) ---
            if ($item->weekly_demand && $item->ordering_cost && $item->holding_cost) {
                $annual_demand = $item->weekly_demand * 52;
                $item->eoq = sqrt((2 * $annual_demand * $item->ordering_cost) / $item->holding_cost);
            }

            // --- Update timestamp ---
            $item->last_updated = now();
        });
    }
}
