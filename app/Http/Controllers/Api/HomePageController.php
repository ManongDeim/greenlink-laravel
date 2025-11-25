<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomePageEvents as Event;
use Illuminate\Http\Request;

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
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'required|string',
            'highlights' => 'nullable|array',
        ]);

        $event = Event::create($request->all());
        return response()->json($event);
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
