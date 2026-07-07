<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    //
    public $timestamps = false;

    public function companies()
    {
        return $this->hasMany(Company::class);
    }
}
