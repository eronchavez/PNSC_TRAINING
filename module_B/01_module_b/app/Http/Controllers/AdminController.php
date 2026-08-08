<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    //

    public function login(Request $req)
    {
        if($req->passphrase === "admin")
            {
                session(["is_admin" => true]);
                return redirect("/companies");
            }
        else 
            {
                return redirect()->back()->withErrors(['error' => 'Passphrase is required || Invalid Passphrase']);
            } 
    }

    
    public function logout(Request $req)
    {
        $req->session()->forget("is_admin");
        $req->session()->invalidate();
        $req->session()->regenerateToken();

        return redirect("/login");
    }
}
