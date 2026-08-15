<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    //
    public function login(Request $req)
    {
        if($req->passphrase === 'admin')
            {
                session(['is_admin' => true]);
                return redirect('/companies');
            }
        else 
            {
                return redirect()->back()->withErrors(['error' => 'Password is required | Invalid Password']);
            }
    }


    public function logout(Request $req)
    {
        session(['is_admin' => false]);
        $req->session()->invalidate();
        $req->session()->regenerateToken();
        return redirect('/login');
    }
}
