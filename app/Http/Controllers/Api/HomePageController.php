<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomePageEvents as Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HomePageController extends Controller
{
    // Get all events for front-end
    public function index()
    {
        $events = Event::all();
        return response()->json($events);
    }

    // Admin: Create new event
   public function store(Request $request)
{
    Log::info("HomePageController@store called", $request->all());

    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'image_url' => 'required|file|mimes:jpeg,png,jpg,gif',
        'highlights' => 'nullable|string',
    ]);

    Log::info("Validation passed");

    try {
        // Handle image upload
        if ($request->hasFile('image_url')) {
            $file = $request->file('image_url');
            $destinationPath = public_path('home_page');
            if (!file_exists($destinationPath)) mkdir($destinationPath, 0775, true);

            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move($destinationPath, $filename);

            $requestData = $request->all();
            $requestData['image_url'] = '/home_page/' . $filename;

            $event = Event::create($requestData);

            Log::info("Home page event created", ['event_id' => $event->id]);

            return response()->json($event);
        } else {
            Log::warning("No image file uploaded");
            return response()->json(['error' => 'No image file uploaded'], 400);
        }
    } catch (\Exception $e) {
        Log::error("Error creating home page event: " . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    // Admin: Update existing event
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'required|string',
            'highlights' => 'nullable|array',
        ]);

        $event->update($request->all());
        return response()->json($event);
    }

    // Admin: Delete an event
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}
