<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    //
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar'
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
