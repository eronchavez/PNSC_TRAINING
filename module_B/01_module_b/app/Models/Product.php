<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    public $timestamps = false;

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function category()
    {
        return  $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
