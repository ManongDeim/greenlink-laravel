<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User; 

class GoogleUser extends Model
{
    use HasFactory;

    protected $table = 'google_users'; // explicitly point to your existing table

    protected $fillable = [
        'user_id',
        'email',
        'avatar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
