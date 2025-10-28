<?php

namespace App\Http\Controllers\Api;

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
            'min_stock' => 'required|integer|min:0',
            'current_stock' => 'required|integer|min:0',
        ]);

        $ingredient = KitchenInventory::create($validated);
        return response()->json(['message' => 'Ingredient added successfully', 'ingredient' => $ingredient]);
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
}
