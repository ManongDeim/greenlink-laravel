<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FarmInventory extends Model
{
    use HasFactory;

    protected $table = 'farm_inventory';
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

        $item->last_updated = now();
    });
}

}
