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


public function store(Request $request)
{
    $validated = $request->validate([
        'room_name' => 'required|string|max:255',
        'description' => 'required|string',
        'min_capacity' => 'required|integer|min:1',
        'max_capacity' => 'required|integer|min:1',
        'price' => 'required|numeric|min:0',
        'image' => 'nullable|image|max:2048',
        'carousel_images.*' => 'nullable|image|max:2048',
        'amenities' => 'nullable|string',
    ]);

    // Create room
    $room = Room::create([
        'room_name' => $validated['room_name'],
        'description' => $validated['description'],
        'min_capacity' => $validated['min_capacity'],
        'max_capacity' => $validated['max_capacity'],
        'price' => $validated['price'],
        'image' => '',
        'carousel_images' => json_encode([]),
        'amenities' => json_encode([]),
    ]);

    // Handle main image
    if ($request->hasFile('image')) {
        $filename = uniqid().".".$request->image->getClientOriginalExtension();
        $path = realpath(base_path('../'))."/rooms";
        
        if (!file_exists($path)) mkdir($path, 0775, true);

        $request->image->move($path, $filename);
        $room->image = "/rooms/".$filename;
    }

    // Handle carousel images
    $carousel = [];
    if ($request->hasFile('carousel_images')) {
        $path = realpath(base_path('../'))."/rooms_carousel";
        if (!file_exists($path)) mkdir($path, 0775, true);

        foreach ($request->file('carousel_images') as $file) {
            $filename = uniqid().".".$file->getClientOriginalExtension();
            $file->move($path, $filename);
            $carousel[] = "/rooms_carousel/".$filename;
        }
    }

    $room->carousel_images = json_encode($carousel);

    // Amenities
    if (!empty($validated['amenities'])) {
        $room->amenities = json_encode(array_map('trim', explode(",", $validated['amenities'])));
    }

    $room->save();

    return response()->json([
        "success" => true,
        "message" => "Room added successfully"
    ]);
}

public function destroy($id)
{
    try {
        $room = Room::find($id);

        if (!$room) {
            return response()->json(['success' => false, 'message' => 'Room not found'], 404);
        }

        // Delete main image
        if ($room->image && file_exists(public_path($room->image))) {
            unlink(public_path($room->image));
        }

        // Delete carousel images
        if (!empty($room->carousel_images)) {
            $carouselImages = json_decode($room->carousel_images, true);

            if (is_array($carouselImages)) {
                foreach ($carouselImages as $imgPath) {
                    if ($imgPath && file_exists(public_path($imgPath))) {
                        unlink(public_path($imgPath));
                    }
                }
            }
        }

        // Delete room
        $room->delete();

        return response()->json(['success' => true, 'message' => 'Room removed successfully']);

    } catch (\Exception $e) {
        Log::error("Error deleting room: " . $e->getMessage());
        return response()->json(['success' => false, 'message' => 'Server error'], 500);
    }
}

}

