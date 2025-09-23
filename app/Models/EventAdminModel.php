<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class EventAdminModel extends Model
{
    protected $table = 'event_reservation';
    protected $fillable = ['id', 'start_date', 'end_date', 'full_name', 'email', 'phone_number', 'pax', 'to_bring', 'approval_status'];
    public $timestamps = false; 

    // Logs

     protected static function booted()
    {
        static::retrieved(function ($reservation) {
            Log::info('Reservation retrieved', $reservation->toArray());
        });

        static::created(function ($reservation) {
            Log::info('New reservation created', $reservation->toArray());
        });

        static::updated(function ($reservation) {
            Log::info('Reservation updated', $reservation->toArray());
        });

        static::deleted(function ($reservation) {
            Log::warning('Reservation deleted', $reservation->toArray());
        });
    }
}
