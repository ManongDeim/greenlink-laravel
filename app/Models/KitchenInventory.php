<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KitchenInventory extends Model
{
    use HasFactory;

    protected $table = 'kitchen_inventory';
    protected $primaryKey = 'id';
    public $timestamps = false; // ✅ only last_updated will be used

    protected $fillable = [
        'item_name',
        'min_stock',
        'current_stock',
        'status',
        'last_updated',
    ];

    protected static function booted()
    {
        static::saving(function ($item) {
            $threshold = $item->min_stock * 0.2;

            if ($item->current_stock <= $item->min_stock) {
                $item->status = 'Low Stock';
            } elseif ($item->current_stock <= ($item->min_stock + $threshold)) {
                $item->status = 'Restock Needed';
            } else {
                $item->status = 'Good';
            }

            $item->last_updated = now();
        });
    }
}
