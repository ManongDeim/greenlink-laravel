<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FarmInventory;

class FarmInventoryController extends Controller
{
    // Fetch all farm items
    public function index()
    {
        return response()->json(FarmInventory::all());
    }

    // Add new farm item
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'min_stock' => 'required|numeric|min:0',
            'current_stock' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'unit_cost' => 'nullable|numeric|min:0',
        ]);

        $item = FarmInventory::create($validated);

        return response()->json([
            'message' => 'Farm item added successfully',
            'item' => $item
        ]);
    }

    // Add stock
    public function addStock(Request $request, $id)
    {
        $request->validate(['amount' => 'required|integer|min:1']);

        $item = FarmInventory::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $item->current_stock += $request->amount;
        $item->save();

        return response()->json(['message' => 'Stock updated successfully', 'item' => $item]);
    }

    // Remove item
    public function destroy($id)
    {
        $item = FarmInventory::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $item->delete();
        return response()->json(['message' => 'Item removed successfully']);
    }

    // Record spoilage/loss
    public function recordSpoilage($id, Request $request)
    {
        $quantity = $request->input('quantity');
        $reason = $request->input('reason');

        $item = FarmInventory::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found.'], 404);
        }

        if ($item->current_stock < $quantity) {
            return response()->json(['message' => 'Not enough stock to deduct.'], 400);
        }

        // Deduct stock
        $item->current_stock -= $quantity;
        $item->last_updated = now();
        $item->save();

        // Log spoilage
        Log::info("🌾 Spoilage/Loss recorded for {$item->item_name}: -{$quantity} {$item->unit} ({$reason})");

        return response()->json([
            'message' => "Spoilage/Loss recorded for {$item->item_name} (-{$quantity} {$item->unit}).",
        ]);
    }
}
