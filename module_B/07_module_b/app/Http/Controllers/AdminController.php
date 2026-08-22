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
                session(["admin" => true]);
                return redirect("/companies");
            }
        else 
            {
                return redirect()->back()->withErrors(["error" => "Invalid Passphrase || Passphrase is Required"]);
            }
    }

    public function logout(Request $req)
    {
        $req->session()->forget("admin");
        $req->session()->invalidate();
        $req->session()->regenerateToken();

        return redirect("/login");
    }
}
