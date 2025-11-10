<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FarmInventory;
use Illuminate\Support\Facades\Log;

class FarmInventoryController extends Controller
{
    /**
     * Fetch all farm inventory items
     */
    public function index()
    {
        return response()->json(FarmInventory::all());
    }

    /**
     * Store a new farm inventory item
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name'     => 'required|string|max:255',
            'min_stock'     => 'required|numeric|min:0',
            'current_stock' => 'required|numeric|min:0',
            'unit'          => 'required|string|max:50',
            'unit_cost'     => 'required|numeric|min:0',
        ]);

        $item = FarmInventory::create($validated);

        return response()->json([
            'message' => 'Farm item added successfully',
            'item' => $item
        ]);
    }

    /**
     * Add stock to an item
     */
    public function addStock(Request $request, $id)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.001',
        ]);

        $item = FarmInventory::find($id);

        if (!$item) {
            return response()->json(['message' => 'Farm item not found'], 404);
        }

        $item->current_stock += $request->amount;
        $item->save();

        return response()->json([
            'message' => 'Stock successfully added',
            'item' => $item
        ]);
    }

    /**
     * Record spoilage or loss
     */
    public function recordSpoilage(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|numeric|min:0.001',
            'reason'   => 'nullable|string|max:500',
        ]);

        $item = FarmInventory::find($id);

        if (!$item) {
            return response()->json(['message' => 'Farm item not found'], 404);
        }

        if ($item->current_stock < $request->quantity) {
            return response()->json(['message' => 'Not enough stock to deduct'], 400);
        }

        // Deduct the stock
        $item->current_stock -= $request->quantity;
        $item->save();

        // Logging (optional)
        Log::info("🌾 Spoilage recorded: {$item->item_name} (-{$request->quantity} {$item->unit}) Reason: {$request->reason}");

        return response()->json([
            'message' => "Spoilage recorded (-{$request->quantity} {$item->unit})",
            'item' => $item
        ]);
    }

    /**
     * Remove an item completely
     */
    public function destroy($id)
    {
        $item = FarmInventory::find($id);

        if (!$item) {
            return response()->json(['message' => 'Farm item not found'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Farm item deleted successfully']);
    }
}
