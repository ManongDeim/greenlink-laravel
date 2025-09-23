<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventModel extends Model
{
     protected $table = 'event_reservation';

    protected $fillable = ['start_date', 'end_date', 'full_name', 'event_type', 'email', 'phone_number', 'pax', 'to_bring', 'approval_status'];

    public $timestamps = false; 
}
