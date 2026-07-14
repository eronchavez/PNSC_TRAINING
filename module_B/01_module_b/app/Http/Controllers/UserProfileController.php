<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class UserProfileController extends Controller
{
    //
    public function edit()
    {
        return view('users.profile', [
            'user' => Auth::user(),
        ]);
    }

    public function update(Request $req)
    {
        $user = Auth::user();

        $validated = $req->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        $user->name = $validated['name'];

        if($req->hasFile('avatar'))
            {
                if($user->avatar)
                    {
                        File::delete(public_path($user->avatar));
                    }
                $avatarName = time() . '.' . $req->avatar->extension();
                $req->avatar->move(public_path('avatars'), $avatarName);
                $user->avatar = 'avatars/' . $avatarName;
            }
        
        $user->save();

        return back()->with('success', 'Profile Updated successfully');
    }

    public function removeAvatar()
    {
        $user = Auth::user();

        if($user->avatar)
            {
                File::delete(public_path($user->avatar));
                $user->avatar = null;
                $user->save();
            }

        return back()->with('success', 'Avatar removed successfully.');
    }


}
