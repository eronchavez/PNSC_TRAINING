<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserAuthController extends Controller
{
    //
    public function showAuthForm()
    {
        return view('users.auth');
    }

   public function register(Request $req)
    {
        $validated = $req->validate([
            'name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'min:6',
                'max:255',
                'unique:users,username',
                'alpha_num',
            ],
            'password' => 'required|string|min:6',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        $avatarPath = null;
        
        // Check if file is uploaded
        if ($req->hasFile('avatar')) {
            $avatar = $req->file('avatar'); // Get the UploadedFile object
            $avatarName = time() . '.' . $avatar->extension();
            $avatar->move(public_path('avatars'), $avatarName);
            $avatarPath = 'avatars/' . $avatarName;
        }

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'avatar' => $avatarPath
        ]);

        Auth::login($user);
        $req->session()->regenerate();

        return redirect('/')->with('success', 'Registration successful.');
    }

    public function login(Request $req)
    {
        $validated = $req->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        if(!Auth::attempt([
            'username' => $validated['username'],
            'password' => $validated['password']
        ])){
            return back()->withErrors([
                'user_login' => "Invalid username or password",
            ])->withInput();
        };

        $req->session()->regenerate();

        return redirect('/');
    }

    public function logout(Request $req)
    {
        Auth::logout();
        $req->session()->invalidate();
        $req->session()->regenerateToken();

        return redirect()->back();
    }
}
