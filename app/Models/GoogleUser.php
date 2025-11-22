<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use App\Models\User; 


class GoogleUser extends Model
{
    use HasFactory;
    use Notifiable;

    protected $table = 'google_users';
    protected $primaryKey = 'user_id'; 
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'avatar',
        'id_photo',
        'id_status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
