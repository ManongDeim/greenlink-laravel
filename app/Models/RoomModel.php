<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomModel extends Model
{
    protected $table = 'room_reservations';

    protected $fillable = ['check_in_date', 'check_out_date', 'full_name','email', 'phone_number', 'pax', 'room', 'payment_method','payment_status'];

    public $timestamps = false; 
}
