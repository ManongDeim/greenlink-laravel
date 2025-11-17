<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\RoomSeederModel as Room;

class RoomSeederController extends Controller
{
     public function index()
    {
         $rooms = Room::all()->map(function ($room) {
        // Decode the carousel_images if it's a JSON string
        if (is_string($room->carousel_images)) {
            $decoded = json_decode($room->carousel_images, true);
            $room->carousel_images = is_array($decoded) ? $decoded : [];
        }
        return $room;
    });

    return response()->json($rooms);
    }

     public function editName(Request $request, $id)
    {
        $request->validate(['room_name' => 'required|string|max:255']);

        $product = Room::findOrFail($id);
        $product->room_name = $request->room_name;
        $product->save();

        return response()->json(['success' => true, 'message' => 'Product name updated']);
    }

    
    public function editPrice(Request $request, $id)
{
    $request->validate([
        'price' => 'required|numeric|min:0',
        
    ]);

    $product = Room::findOrFail($id);
    $product->price = $request->price;
    $product->save();

    return response()->json([
        'success' => true,
        'message' => 'Product price and measurement updated',
    ]);
}

public function replacePhoto(Request $request, $id)
{
    $request->validate(['image' => 'required|file|image|max:2048']);

    $product = Room::findOrFail($id);

    // ✅ Corrected absolute path to the real public_html/farm_products
    $destinationPath = realpath(base_path('../')) . '/rooms';

    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0775, true);
    }

    $filename = uniqid() . '.' . $request->file('image')->getClientOriginalExtension();

    // ✅ Move file correctly
    $request->file('image')->move($destinationPath, $filename);

    $product->image = '/rooms/' . $filename;
    $product->save();

    Log::info('✅ File moved correctly to:', ['path' => $destinationPath . '/' . $filename]);

    return response()->json(['success' => true, 'message' => 'Product photo replaced successfully']);
}

}
