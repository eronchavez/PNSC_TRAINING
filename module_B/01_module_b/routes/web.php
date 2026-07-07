<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function(){
    return view('auth.login');
});

Route::post('/login',[ AuthController::class, 'login']);

    Route::post('/logout', function(Request $request)
    {
        $request->session()->forget('is_admin');
        $request->session()->regenerateToken();
        return redirect('/login');
    });

Route::middleware('admin')->group(function() {


      
    // Route for companies
    Route::get('/companies', [CompanyController::class, 'index']);
    Route::get('/companies/{company}', [CompanyController::class, 'show']);
    Route::get('/companies/new', [CompanyController::class, 'create']);
    Route::post('/companies', [CompanyController::class, 'store']);
    Route::get('/companies/{company}/edit', [CompanyController::class, 'edit']);
    Route::put('/companies/{company}/update',[CompanyController::class, 'update']);
    Route::put('/companies/{company}/deactivate', [CompanyController::class, 'deactivate']);
}); 