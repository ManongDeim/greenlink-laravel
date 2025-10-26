<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FarmProduct;

class FarmProductController extends Controller
{
    public function index()
    {
        return response()->json(FarmProduct::all());
    }

     public function editName(Request $request, $id)
    {
        $request->validate(['productName' => 'required|string|max:255']);

        $product = FarmProduct::findOrFail($id);
        $product->productName = $request->productName;
        $product->save();

        return response()->json(['success' => true, 'message' => 'Product name updated']);
    }

    public function editPrice(Request $request, $id)
    {
        $request->validate(['price' => 'required|numeric|min:0']);

        $product = FarmProduct::findOrFail($id);
        $product->price = $request->price;
        $product->save();

        return response()->json(['success' => true, 'message' => 'Product price updated']);
    }

    public function replacePhoto(Request $request, $id)
{
    $request->validate([
        'productPicture' => 'required|file|image|max:2048',
    ]);

    $product = FarmProduct::findOrFail($id);

    // Ensure the destination folder exists
    $destinationPath = public_path('farm_products');
    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0777, true);
    }

    // Generate a unique file name
    $fileName = uniqid() . '.' . $request->file('productPicture')->getClientOriginalExtension();

    // Move the uploaded image directly into /public_html/farm_products
    $request->file('productPicture')->move($destinationPath, $fileName);

    // Save the public URL path to the database
    $product->productPicture = '/farm_products/' . $fileName;
    $product->save();

    return response()->json([
        'success' => true,
        'message' => '✅ Product photo replaced successfully',
    ]);
}


    public function addStock(Request $request, $id)
    {
        $request->validate(['qty' => 'required|integer|min:1']);

        $product = FarmProduct::findOrFail($id);
        $product->qty += $request->qty;
        $product->save();

        return response()->json(['success' => true, 'message' => 'Stock added']);
    }
}
