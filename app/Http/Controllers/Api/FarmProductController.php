<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FarmProduct;
  use Illuminate\Support\Facades\Log;

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

    // 🔍 Step 1: Log current working directory and path we’ll save to
    $destinationPath = base_path('../public_html/farm_products');
    Log::info('Saving photo to: ' . $destinationPath);

    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0775, true);
        Log::info('Created missing directory: ' . $destinationPath);
    }

    $filename = uniqid() . '.' . $request->file('productPicture')->getClientOriginalExtension();
    $file = $request->file('productPicture');

    // 🔍 Step 2: Log the file’s original name and confirm it exists
    Log::info('Uploading file: ' . $file->getClientOriginalName());

    try {
        $file->move($destinationPath, $filename);
        Log::info('✅ File moved successfully to ' . $destinationPath . '/' . $filename);
    } catch (\Exception $e) {
        Log::error('❌ Failed to move file: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to upload file. Check logs.'], 500);
    }

    $product->productPicture = '/farm_products/' . $filename;
    $product->save();

    Log::info('✅ Database updated with new path: /farm_products/' . $filename);

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
