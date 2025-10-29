<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\KitchenInventory;

class KitchenInventoryController extends Controller
{
    // Fetch all ingredients
    public function index()
    {
        return response()->json(KitchenInventory::all());
    }

    // Add new ingredient
   public function store(Request $request)
{
    $validated = $request->validate([
        'item_name' => 'required|string|max:255',
        'min_stock' => 'required|numeric|min:0',
        'current_stock' => 'required|numeric|min:0',
        'unit' => 'required|string|max:50',
        'unit_cost' => 'nullable|numeric|min:0',
        'weekly_demand' => 'nullable|numeric|min:0',
        'ordering_cost' => 'nullable|numeric|min:0',
    ]);

    $ingredient = KitchenInventory::create($validated);

    return response()->json([
        'message' => 'Ingredient added successfully',
        'ingredient' => $ingredient
    ]);
}
    // Add stock
    public function addStock(Request $request, $id)
    {
        $request->validate(['amount' => 'required|integer|min:1']);

        $ingredient = KitchenInventory::find($id);
        if (!$ingredient) {
            return response()->json(['message' => 'Ingredient not found'], 404);
        }

        $ingredient->current_stock += $request->amount;
        $ingredient->save();

        return response()->json(['message' => 'Stock updated successfully', 'ingredient' => $ingredient]);
    }

    // Remove item
    public function destroy($id)
    {
        $ingredient = KitchenInventory::find($id);
        if (!$ingredient) {
            return response()->json(['message' => 'Ingredient not found'], 404);
        }

        $ingredient->delete();
        return response()->json(['message' => 'Ingredient removed successfully']);
    }

    // Record spoilage/loss

    public function recordSpoilage($id, Request $request)
{
    $quantity = $request->input('quantity');
    $reason = $request->input('reason');

    $item = KitchenInventory::find($id);
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

    // Optional: Log spoilage
    Log::info("🧾 Spoilage/Loss recorded for {$item->item_name}: -{$quantity} {$item->unit} ({$reason})");

    return response()->json([
        'message' => "Spoilage/Loss recorded for {$item->item_name} (-{$quantity} {$item->unit}).",
    ]);
}
}
