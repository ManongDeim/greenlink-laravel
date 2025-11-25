<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomePageEvents extends Model
{
    protected $table = 'home_page_events';

    protected $fillable = [
        'title',
        'description',
        'image_url',
        'highlights',
    ];

    protected $casts = [
        'highlights' => 'array', // Automatically decode JSON to array
    ];
}
