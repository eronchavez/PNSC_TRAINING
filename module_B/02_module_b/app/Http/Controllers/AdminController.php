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
                session(['admin' => true]);
                return redirect('/companies');
            }

        return redirect()->back()->withErrors([
            'error' => 'The password is required | Invalid Password'
        ]);
        
    }

    public function logout(Request $req)
    {
        $req->session()->forget('admin');
        $req->session()->regenerateToken();
        $req->session()->invalidate();
        return redirect('/login');
    }
}
