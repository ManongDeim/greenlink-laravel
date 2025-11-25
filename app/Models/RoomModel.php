<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\RoomSeederModel;

class RoomModel extends Model
{
    protected $table = 'room_reservations';

    protected $fillable = [
        'user_id',
        'room_id',
        'room_reser_id',
        'check_in_date', 
        'check_out_date',
        'full_name',
        'email',
        'phone_number', 
        'pax',
        'room', 
        'total_bill',
        'payment_method',
        'payment_status',
        'ref_number',
        'paymongo_session_id',
        'paymongo_payment_id',
        'status'
        ];

    public $timestamps = false; 

    public function room()
{
    return $this->belongsTo(RoomSeederModel::class, 'room_id');
}

}
