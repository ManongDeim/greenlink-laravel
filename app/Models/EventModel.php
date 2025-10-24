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
}
