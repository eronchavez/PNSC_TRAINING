<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //
    public function login(Request $req)
    {
        if($req->passphrase  === 'admin')
            {
                session(['is_admin' => true]);
                return redirect('/companies');
            }

        return redirect()->back()->withErrors(['error' => 'Invalid passphrase']);
    }

    public function logout(Request $req)
    {
        $req->session()->forget('is_admin');
        $req->session()->regenerateToken();
        return redirect('/login');
    }

   





}
 