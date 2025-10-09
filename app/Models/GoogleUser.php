<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User; 

class GoogleUser extends Model
{
    use HasFactory;

    protected $table = 'google_users';
    protected $primaryKey = 'user_id'; 
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'user_id',
        'email',
        'avatar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
