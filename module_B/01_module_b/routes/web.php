<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function(){
    return view('auth.login');
});

Route::post('/login',[ AuthController::class, 'login']);

Route::middleware('admin')->group(function() {
    // place your admin routes
    Route::get('/companies', [CompanyController::class, 'index']);
    Route::get('/companies/new', [CompanyController::class, 'create']);
    Route::get('/companies/{company}/edit', [CompanyController::class, 'edit']);
    Route::put('/companies/{company}/update',[CompanyController::class, 'update']);
    Route::put('/companies/{company}/deactivate', [CompanyController::class, 'deactivate']);
}); 