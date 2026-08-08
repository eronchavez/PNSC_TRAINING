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

    // POST user/register
    public function register(Request $req)
    {
        $validated = $req->validate([
            'name' => 'required|string',
            'username' => 'required|string|min:6|max:255|alpha_num|unique:users,username',
            'password' => 'required|string:min:6',
            'avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif,svg|max:2048'
        ]);

        
        if($req->hasFile('avatar'))
            {
                $avatar = $req->file('avatar');
                $avatarName = time() . "." . $avatar->extension();
                $avatar->move(public_path('avatars'), $avatarName);
                $validated['avatar'] = $avatarName;
            }

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        Auth::login($user); // Auto log in after register
        $req->session()->regenerate();

        return redirect('/')->with('success', 'Registration successful.');
    }

    // POST user/login
    public function login(Request $req)
    {
        $validated = $req->validate([
            'login_username' => 'required',
            'login_password' => 'required'
        ]);

        $credentials  = [
            'username' => $validated['login_username'],
            'password' => $validated['login_password']
        ];

        if(!Auth::attempt($credentials)){
            return back()->withErrors(['user_login' => 'Invalid username or password']);
        }

        $req->session()->regenerate();

        return redirect('/');
    }

    // POST /user/logout 
    public function logout(Request $req)
    {
        Auth::logout();
        $req->session()->invalidate();
        $req->session()->regenerateToken();
        
        return redirect('/');
    }

    public function profile()
    {
        $user = Auth::user();

        return view('users.profile', compact('user'));
    }

    public function update(Request $req)
    {
        $validated = $req->validate([
            'name' => 'required'
        ]);

        $user = Auth::user();
        $user->update($validated);

        return redirect()->back()->with('success', 'Profile successfully updated!');
    }   

    
    public function changeAvatar(Request $req)
    {
        $req->validate([
            'avatar' => 'required|mimes:svg,png,jpeg,jpg,gif|max:2048'
        ]);

        $avatar = $req->file('avatar');
        $avatarName = time() . '.' . $avatar->extension();
        $avatar->move(public_path('avatars'), $avatarName);
    

        $user = Auth::user();
        $user->avatar = $avatarName;
        $user->save();

        return redirect()->back()->with('success', 'avatar Successfully Changed!');
    }

    public function removeAvatar()
    {
        $user = Auth::user();
        $user->avatar = NULL; 
        $user->save();

        return redirect()->back()->with('success', 'Avatar successfully  removed!');
    }
}
