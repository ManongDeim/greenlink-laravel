<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EventSeederModel as Event;

class EventSeederController extends Controller
{
    public function index()
    {
        return response()->json(Event::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_name'     => 'required|string|max:255',
            'max_pax'     => 'required|integer|min:1',
        ]);

        $item = Event::create($validated);

        return response()->json([
            'message' => 'Event added successfully',
            'item' => $item
        ]);
    }

     public function editName(Request $request, $id)
    {
        $request->validate(['event_name' => 'required|string|max:255']);

        $product = Event::findOrFail($id);
        $product->event_name = $request->event_name;
        $product->save();

        return response()->json(['success' => true, 'message' => 'Product name updated']);
    }

    public function editPax(Request $request, $id)
{
    $request->validate([
        'price' => 'required|numeric|min:0',
        'measurement' => 'nullable|string|max:255',
    ]);

    $product = Event::findOrFail($id);
    $product->max_pax = $request->max_pax;
    $product->save();

    return response()->json([
        'success' => true,
        'message' => 'Event maximum pax updated',
    ]);
}

public function destroy($id)
    {
        $item = Event::find($id);

        if (!$item) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
