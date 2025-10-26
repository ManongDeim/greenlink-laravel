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
        $request->validate(['productPicture' => 'required|file|image|max:2048']);

        $product = FarmProduct::findOrFail($id);
        $path = $request->file('productPicture')->store('farm_products', 'public');
        $product->productPicture = "/storage/" . $path;
        $product->save();

        return response()->json(['success' => true, 'message' => 'Product photo replaced']);
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
