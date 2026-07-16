<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProductController;
use App\Models\Category;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});



Route::get('/login', function(){
    return view('auth.login');
});

Route::post('/login', [AdminController::class, 'login']);

// Route for GTINS
Route::get('/verify', function(){
    return view('public.verify');
});
Route::post('/verify', [ProductController::class, 'verifyGTINs']);

// Route for Public Page 
Route::get('/', [ProductController::class, 'getProductsPublic']);
Route::get('/01/{product:gtin}', [ProductController::class, 'getProductPublic']);


//Route for JSON 
Route::get('products.json', [ProductController::class, 'getProductsJson']);
Route::get('products/{product:gtin}.json', [ProductController::class, 'getProductJson']);



Route::middleware('admin401')->group(function(){
    Route::get('/categories/new', [CategoryController::class, 'create']);
    
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::get('/categories/{category}', [CategoryController::class, 'edit']);
    Route::get('/products/new', [ProductController::class, 'create']);
    Route::put('/products/{product:gtin}/changeImage', [ProductController::class, 'changeImage']);
    Route::get('/companies/new', [CompanyController::class, 'create']);
    // Route for logout
    Route::post('/logout', [AdminController::class, 'logout']);
    Route::get('/companies', [CompanyController::class, 'index']);
    Route::get('/companies/{company}', [CompanyController::class, 'show']);
    Route::post('/companies', [CompanyController::class, 'store']);
    Route::get('/companies/{company}/edit', [CompanyController::class, 'edit']);
    Route::put('/companies/{company}/update', [CompanyController::class, 'update']);
    Route::put('/companies/{company}/deactivate', [CompanyController::class, 'deactivate']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product:gtin}', [ProductController::class, 'show']);
    
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product:gtin}/removeImage', [ProductController::class, 'removeImage']);
    Route::put('/products/{product:gtin}/hide', [ProductController::class, 'hide']);
    Route::delete('/products/{product:gtin}/destroy', [ProductController::class, 'destroy']);

    Route::get('/categories', [CategoryController::class, 'index']);
 
    Route::post('/categories', [CategoryController::class, 'store']);
   
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
});