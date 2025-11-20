<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\FoodProduct;
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
    dd('Reached store method', $request->all());

    $validated = $request->validate([
        'productName' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'productPicture' => 'nullable|image|max:2048',
        'ingredients' => 'required|array',
        'ingredients.*' => 'integer|exists:kitchen_inventory,id',
        'quantities' => 'required|array',
        'quantities.*' => 'numeric|min:0',

    ]);

    // Save FoodProduct
    $product = FoodProduct::create([
        'productName' => $validated['productName'],
        'price' => $validated['price'],
    ]);

    // Handle image
    if ($request->hasFile('productPicture')) {
        $destinationPath = realpath(base_path('../')) . '/food_products';
        if (!file_exists($destinationPath)) mkdir($destinationPath, 0775, true);

        $filename = uniqid() . '.' . $request->file('productPicture')->getClientOriginalExtension();
        $request->file('productPicture')->move($destinationPath, $filename);

        $product->productPicture = '/food_products/' . $filename;
        $product->save();
    }

    // Save ingredients
    $ingredients = $request->input('ingredients', []);
$quantities = $request->input('quantities', []);

foreach ($ingredients as $index => $ingredientId) {
    $quantity = $quantities[$index] ?? 0; // match by index, not key
    if ($quantity > 0) {
        $product->ingredients()->create([
            'ingredient_id' => $ingredientId,
            'quantity_used' => $quantity
        ]);
    }
}

    return response()->json(['success' => true, 'message' => 'Food product created successfully']);
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
}
