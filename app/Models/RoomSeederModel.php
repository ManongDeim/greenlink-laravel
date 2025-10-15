<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RoomSeederModel extends Model
{
    use HasFactory;

    protected $table = 'rooms';

      protected $fillable = [
        'roomId',
        'room_name',
        'description',
        'min_capacity',
        'max_capacity',
        'price',
        'image',
        'carousel_images',
        'book_now_url',
    ];

     protected $casts = [
        'carousel_images' => 'array', 
    ];
}
