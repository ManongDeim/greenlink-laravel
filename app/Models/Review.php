<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'food_order_id',
        'farm_order_id',
        'room_reservation_id',
        'event_reservation_id',
        'stars',
        'comment',
        'review_status',
    ];

    protected $attributes = [
        'review_status' => 'Not Reviewed',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function foodOrder() { return $this->belongsTo(FoodOrderModel::class, 'food_order_id'); }
    public function farmOrder() { return $this->belongsTo(FarmOrderModel::class, 'farm_order_id'); }
    public function roomReservation() { return $this->belongsTo(RoomModel::class, 'room_reservation_id'); }
    public function eventReservation() { return $this->belongsTo(EventModel::class, 'event_reservation_id'); }
}
