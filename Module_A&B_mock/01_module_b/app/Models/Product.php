<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //  

    protected $fillable = [
        'name',
        'french_name',
        'gtin',
        'description',
        'french_description',
        'brand',
        'category_id',
        'country',
        'gross_weight',
        'net_weight',
        'weight_unit',
        'hidden',
        'image',
        'company_id'
    ];

    public $timestamps = false;

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

}
