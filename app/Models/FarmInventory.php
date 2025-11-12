<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FarmInventory extends Model
{
    use HasFactory;

    protected $table = 'farm_inventory';
    public $timestamps = false;

    protected $fillable = [
        'item_name',
        'min_stock',
        'current_stock',
        'unit',
        'unit_conversion',
        'unit_cost',
        'status',
        'last_updated',
    ];

    protected $casts = [
        'min_stock'     => 'float',
        'current_stock' => 'float',
        'unit_cost'     => 'float',
    ];

    protected static function booted()
    {
        static::saving(function ($item) {

            // ---- Auto Status Logic ----
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

            // ---- Update Timestamp ----
            $item->last_updated = now();
        });
    }
}
