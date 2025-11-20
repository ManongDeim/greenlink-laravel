<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventSeederModel extends Model
{
    protected $table = 'events';
    public $timestamps = false;
    protected $fillable = [
        'event_name',
        'max_pax'
    ];
}
