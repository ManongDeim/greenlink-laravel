<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

    // ✅ Absolute path to your real public_html folder (outside Laravel)
    $destinationPath = base_path('../public_html/farm_products');

    // ✅ Create folder if missing
    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0775, true);
    }

    // ✅ Unique filename
    $filename = uniqid() . '.' . $request->file('productPicture')->getClientOriginalExtension();

    // ✅ Move file to actual Hostinger public_html folder
    $request->file('productPicture')->move($destinationPath, $filename);

    // ✅ Update DB with the correct public URL
    $product->productPicture = '/farm_products/' . $filename;
    $product->save();

    Log::info('✅ File moved to actual Hostinger folder:', ['path' => $destinationPath . '/' . $filename]);

    return response()->json(['success' => true, 'message' => 'Product photo replaced successfully']);
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
