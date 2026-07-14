<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;




Route::get('/login', function(){
    return view('auth.login');
});



// User 
Route::get('user/auth', [UserAuthController::class, 'showAuthForm']);
Route::post('user/register', [UserAuthController::class, 'register']);
Route::post('user/login', [UserAuthController::class, 'login']);

// Logged in user routes 
Route::middleware('auth.401')->group(function(){
    Route::post('user/logout', [UserAuthController::class, 'logout']);
    Route::get('profile', [UserProfileController::class, 'edit']);
    Route::put('profile', [UserProfileController::class, 'update']);
    Route::delete('profile/avatar', [UserProfileController::class, 'removeAvatar']);
    Route::post('01/{product:gtin}/reviews', [ReviewController::class, 'store']);
});


// Route for GTIN 

Route::get('/verify', function(){
    return view('public.verify');
});
Route::post('/verify', [ProductController::class, 'verifyGTINs']);


//Route for public 
Route::get('/', [ProductController::class, 'getProductsPublic']);
Route::get('01/{product:gtin}', [ProductController::class,  'getProductPublic']);

// Route for API format
Route::get('products.json', [ProductController::class, 'getProductsJson']);
Route::get('products/{product:gtin}.json', [ProductController::class, 'getProductJson']);



Route::post('/login',[ AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('admin')->group(function() {

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/new', [ProductController::class, 'create']);
       
     

      
    // Route for companies
    Route::get('/companies', [CompanyController::class, 'index']);
    Route::get('/companies/{company}', [CompanyController::class, 'show']);
    Route::get('/companies/new', [CompanyController::class, 'create']);
    Route::post('/companies', [CompanyController::class, 'store']);
    Route::get('/companies/{company}/edit', [CompanyController::class, 'edit']);
    Route::put('/companies/{company}/update',[CompanyController::class, 'update']);
    Route::put('/companies/{company}/deactivate', [CompanyController::class, 'deactivate']);

    // Route for products 

    Route::get('/products/{product:gtin}', [ProductController::class, 'show']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product:gtin}/changeImage', [ProductController::class, 'changeImage']);
    Route::put('/products/{product:gtin}/removeImage', [ProductController::class, 'removeImage']);
    Route::put('/products/{product:gtin}/hide', [ProductController::class, 'hide']);
    Route::delete('/products/{product:gtin}/destroy', [ProductController::class, 'destroy']);

    //Route for Categories 
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/new', [CategoryController::class, 'create']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit']);
    Route::put('/categories/{category}/update', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}/destroy', [CategoryController::class, 'destroy']);

    
}); 