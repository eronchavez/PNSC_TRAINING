<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;




Route::get('/verify', function() {
    return view('public.verify');
});
Route::post('/result', [ProductController::class, 'verifyGTINs']);


Route::get('/', [ProductController::class, 'getProductsPublic']);

Route::get('01/{product:gtin}', [ProductController::class, 'getProductPublic']);

Route::get('products.json', [ProductController::class, 'getProductsJson']);
Route::get('products/{product:gtin}.json', [ProductController::class, 'getProductJson']);

Route::get('/login', function () {
    return view('auth.login');
});


Route::post('/login', [AdminController::class, 'login']);

Route::middleware('admin401')->group(function(){
    Route::put('/products/{product:gtin}/changeImage', [ProductController::class, 'changeImage']);
    Route::get('/companies/new', [CompanyController::class, 'create']); 
   Route::post('/logout', [AdminController::class, 'logout']);

    Route::get("/companies", [CompanyController::class, 'index']);
    Route::get("/companies/{company}", [CompanyController::class, 'show']);
    
    Route::post('/companies', [CompanyController::class, 'store']);
    Route::put('/companies/{company}/deactivate', [CompanyController::class, 'deactivate']);
    Route::get('/companies/{company}/edit', [CompanyController::class, 'edit']);
    Route::put('/companies/{company}/update', [CompanyController::class, 'update']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/new', [ProductController::class, 'create']);
    Route::get('/products/{product:gtin}', [ProductController::class, 'show']);
    Route::post('/products', [ProductController::class, 'store']);
   
    Route::put('/products/{product:gtin}/removeImage', [ProductController::class, 'removeImage']);
    Route::put('/products/{product:gtin}/hide', [ProductController::class, 'hide']);
    Route::delete('/products/{product:gtin}/destroy', [ProductController::class, 'destroy']);


    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/new', [CategoryController::class, 'create']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit']);
    Route::put('/categories/{category}/update', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}/destroy', [CategoryController::class, 'destroy']);


}); 