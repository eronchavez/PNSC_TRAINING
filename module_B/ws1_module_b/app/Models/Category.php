<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //
    public $timestamp = false;

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
}
