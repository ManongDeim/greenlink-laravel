<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    public function submit(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:food,farm,room,event',
            'id' => 'required',
            'stars' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $data = [
            'user_id' => $request->user()->id,
            'stars' => $request->stars,
            'comment' => $request->comment,
            'review_status' => 'Not Reviewed', // default
        ];

        switch ($request->type) {
            case 'food':
                $data['food_order_id'] = $request->id;
                break;
            case 'farm':
                $data['farm_order_id'] = $request->id;
                break;
            case 'room':
                $data['room_reservation_id'] = $request->id;
                break;
            case 'event':
                $data['event_reservation_id'] = $request->id;
                break;
        }

        $review = Review::create($data);

        return response()->json([
            'success' => true,
            'review' => $review->load('user')
        ]);
    }

    public function adminList(Request $request)
    {
        $type = $request->query('type');
        $status = $request->query('status');

        $query = Review::with('user')
            ->select('reviews.*');

        if ($type === 'food') $query->whereNotNull('food_order_id');
        if ($type === 'farm') $query->whereNotNull('farm_order_id');
        if ($type === 'room') $query->whereNotNull('room_reservation_id');
        if ($type === 'event') $query->whereNotNull('event_reservation_id');

        if ($status === 'Reviewed') $query->where('review_status', 'Reviewed');
        else if ($status === 'Not Reviewed') $query->where('review_status', 'Not Reviewed');

        $query->orderBy('created_at', 'DESC');

        return response()->json($query->get());
    }

    public function markReviewed($id)
    {
        $review = Review::find($id);
        if (!$review) return response()->json(['error' => 'Review not found'], 404);

        $review->review_status = 'Reviewed';
        $review->save();

        return response()->json(['success' => true]);
    }

    public function deleteReview($id)
    {
        $review = Review::find($id);
        if (!$review) return response()->json(['error' => 'Review not found'], 404);

        $review->delete();

        return response()->json(['success' => true]);
    }
}
