<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\FoodProduct;
use App\Models\FoodIngredient;
use App\Models\KitchenInventory;

class FoodProductController extends Controller
{
     public function index()
    {
        return response()->json(FoodProduct::all());
    }

        public function getIngredients()
{
    $ingredients = KitchenInventory::all();
    return response()->json($ingredients);
}

public function store(Request $request)
{
    try {
        // Validate input
        $validated = $request->validate([
            'productName' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'productPicture' => 'nullable|image|max:2048',
            'ingredients' => 'required|array',
            'ingredients.*' => 'integer|exists:kitchen_inventory,id',
            'quantities' => 'required|array',
            'quantities.*' => 'nullable|numeric|min:0',
        ]);

        // Create product
        $product = FoodProduct::create([
            'productName' => $validated['productName'],
            'price' => $validated['price'],
        ]);

        // Handle image upload
        if ($request->hasFile('productPicture')) {
            $destinationPath = realpath(base_path('../')) . '/food_products';
            if (!file_exists($destinationPath)) mkdir($destinationPath, 0775, true);

            $filename = uniqid() . '.' . $request->file('productPicture')->getClientOriginalExtension();
            $request->file('productPicture')->move($destinationPath, $filename);

            $product->productPicture = '/food_products/' . $filename;
            $product->save();
        }


        // Save ingredients
        if ($request->has('ingredients')) {
    $syncData = [];
    foreach ($request->ingredients as $ingredientId) {
        $quantity = $request->quantities[$ingredientId] ?? 0;
        if ($quantity > 0) {
            $syncData[$ingredientId] = ['quantity_used' => $quantity];
        }
    }
    $product->ingredients()->sync($syncData); // sync handles inserting into pivot
}

        return response()->json(['success' => true, 'message' => 'Food product created successfully']);

    } catch (\Exception $e) {
        // Log the full exception
        Log::error('Error creating food product', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'request' => $request->all()
        ]);

        // Return JSON error to frontend
        return response()->json(['success' => false, 'message' => 'Failed to create food product'], 500);
    }
}



    public function editName(Request $request, $id)
    {
        $request->validate(['productName' => 'required|string|max:255']);

        $product = FoodProduct::findOrFail($id);
        $product->productName = $request->productName;
        $product->save();

        return response()->json(['success' => true, 'message' => 'Product name updated']);
    }

    public function editPrice(Request $request, $id)
    {
    $request->validate([
        'price' => 'required|numeric|min:0'
    ]);

    $product = FoodProduct::findOrFail($id);
    $product->price = $request->price;
    $product->save();

    return response()->json([
        'success' => true,
        'message' => 'Product price updated',
    ]);
    }

    public function replacePhoto(Request $request, $id)
{
    $request->validate(['productPicture' => 'required|file|image|max:2048']);

    $product = FoodProduct::findOrFail($id);

    // ✅ Corrected absolute path to the real public_html/farm_products
    $destinationPath = realpath(base_path('../')) . '/food_products';

    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0775, true);
    }

    $filename = uniqid() . '.' . $request->file('productPicture')->getClientOriginalExtension();

    // ✅ Move file correctly
    $request->file('productPicture')->move($destinationPath, $filename);

    $product->productPicture = '/food_products/' . $filename;
    $product->save();

    Log::info('✅ File moved correctly to:', ['path' => $destinationPath . '/' . $filename]);

    return response()->json(['success' => true, 'message' => 'Product photo replaced successfully']);
}

public function getExistingIngredients($id)
{
    $product = FoodProduct::with('ingredientsDetails')->findOrFail($id);

    // Return:
    // product ingredients AND kitchen inventory list
    return response()->json([
        'product' => $product,
        'kitchen' => KitchenInventory::all()
    ]);
}

public function updateIngredients(Request $request, $id)
{
    $request->validate([
        'ingredients' => 'array',
        'ingredients.*' => 'integer|exists:kitchen_inventory,id',
        'quantities' => 'array',
        'quantities.*' => 'numeric|min:0'
    ]);

    $product = FoodProduct::findOrFail($id);

    // Delete old ingredients
    FoodIngredient::where('food_product_id', $id)->delete();

    // Insert updated
    foreach ($request->ingredients as $ingredientId) {
        $qty = $request->quantities[$ingredientId] ?? 0;

        if ($qty > 0) {
            FoodIngredient::create([
                'food_product_id' => $id,
                'ingredient_id' => $ingredientId,
                'quantity_used' => $qty
            ]);
        }
    }

    return response()->json(['success' => true]);
}

public function destroy($id)
{
    try {
        $product = FoodProduct::find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Food item not found'], 404);
        }

        // Delete image file if exists
        if ($product->productPicture && file_exists(public_path($product->productPicture))) {
            unlink(public_path($product->productPicture));
        }

        // Delete food product (ingredients deleted via cascade)
        $product->delete();

        return response()->json(['success' => true, 'message' => 'Food item removed successfully']);
        
    } catch (\Exception $e) {
        Log::error("Error deleting food product: " . $e->getMessage());
        return response()->json(['success' => false, 'message' => 'Server error'], 500);
    }
}


}


