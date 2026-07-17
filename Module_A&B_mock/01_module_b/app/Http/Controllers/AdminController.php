<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    //

    public function login(Request $req)
    {
        if($req->input('passphrase') === 'admin')
            {
                session(['is_admin' => true]);
                return redirect('/companies');
            }
        
        return redirect()->back()->withErrors(['error' => 'Password is required | Invalid Password']);
    }


    public function logout(Request $req)
    {
        $req->session()->forget('is_admin');
        $req->session()->invalidate();
        $req->session()->regenerateToken();

        return redirect('/login');


    }
}
