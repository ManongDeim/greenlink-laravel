<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventModel extends Model
{
    use HasFactory;

    protected $table = 'event_reservation';
     public $timestamps = false;

    protected $fillable = [
        'user_id',
        'event_id',
        'event_reservation_id',
        'start_datetime',
        'end_datetime',
        'full_name',
        'event_type',
        'email',
        'phone_number',
        'pax',
        'to_bring',
        'approval_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

     protected static function boot()
    {
        parent::boot();

        static::creating(function ($reservation) {
            // Generate until unique
            do {
                $code = 'EVENT-' . random_int(10000, 99999);
            } while (self::where('event_reservation_id', $code)->exists());

            $reservation->event_reservation_id = $code;
        });
    }
}
