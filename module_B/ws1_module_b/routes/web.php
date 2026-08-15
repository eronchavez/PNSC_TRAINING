<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProductController;
use App\Models\Company;
use App\Models\Product;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/login', function(){
    return view('auth.login');
});

Route::post('/login', [AdminController::class, 'login']);


Route::middleware('admin401')->group(function(){

    Route::get('/companies/new', [CompanyController::class, 'create']);
    Route::post('/logout', [AdminController::class, 'logout']);

    Route::get('/companies', [CompanyController::class, 'index']);
    Route::get('/companies/{company}', [CompanyController::class, 'show']);
    
    Route::post('/companies/', [CompanyController::class, 'store']);
    Route::get('/companies/{company}/edit', [CompanyController::class, 'edit']);
    Route::put('/companies/{company}/update', [CompanyController::class, 'update']);
    Route::put('/companies/{company}/deactivate', [CompanyController::class, 'deactivate']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product:gtin}', [ProductController::class, 'show']);
    Route::get('/products/new', [ProductController::class, 'create']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product:gtin}/hide', [ProductController::class, 'hide']);
    Route::put('/products/{product:gtin}/changeImage', [ProductController::class, 'changeImage']);
    Route::put('/products/{product:gtin}/removeImage', [ProductController::class, 'removeImage']);
    Route::delete('/products/{product:gtin}/destroy', [ProductController::class, 'destroy']);


});