<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    //
    public $timestamps = false;

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

}
