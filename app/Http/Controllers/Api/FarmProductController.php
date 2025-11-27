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
    $products = FarmProduct::leftJoin('farm_inventory', 'farm_products.productName', '=', 'farm_inventory.item_name')
        ->select(
            'farm_products.*',
            'farm_inventory.status as inventory_status'
        )
        ->get();

    return response()->json($products);
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
    $request->validate([
        'price' => 'required|numeric|min:0',
        'measurement' => 'nullable|string|max:255',
    ]);

    $product = FarmProduct::findOrFail($id);
    $product->price = $request->price;
    $product->measurement = $request->measurement;
    $product->save();

    return response()->json([
        'success' => true,
        'message' => 'Product price and measurement updated',
    ]);
}



public function replacePhoto(Request $request, $id)
{
    $request->validate(['productPicture' => 'required|file|image|max:2048']);

    $product = FarmProduct::findOrFail($id);

    // ✅ Corrected absolute path to the real public_html/farm_products
    $destinationPath = realpath(base_path('../')) . '/farm_products';

    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0775, true);
    }

    $filename = uniqid() . '.' . $request->file('productPicture')->getClientOriginalExtension();

    // ✅ Move file correctly
    $request->file('productPicture')->move($destinationPath, $filename);

    $product->productPicture = '/farm_products/' . $filename;
    $product->save();

    Log::info('✅ File moved correctly to:', ['path' => $destinationPath . '/' . $filename]);

    return response()->json(['success' => true, 'message' => 'Product photo replaced successfully']);
}


}
