<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sign Up | Sign In</title>
</head>

<body>
    <h1>Sign Up</h1>
    <form action="{{ url('user/register') }}" method="POST">
        @csrf
        <div>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" value="{{ old('name') }}" required> <br>
            @error('name')
    
            <p style="color: red">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <label for="avatar">Avatar</label>
            <input type="file" id="avatar" name="avatar" value="{{ old('avatar') }}" > <br>
            @error('avatar')
                <p style="color: red">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="{{ old('username') }}" required> <br>
            @error('username')
                <p style="color: red">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" value="{{ old('password') }}" required> <br>
            @error('password')
                <p style="color: red">{{ $message }}</p>
            @enderror
        </div>

        <button type="submit">Create Account</button>
    </form>

    <h1>Sign In</h1>
    <form action="{{ url('/user/login') }}" method="POST">
        @csrf
        
        <div>
              <label for="login_username">Username</label>
            <input type="text" id="login_username" name="login_username" 
                value="{{ old("login_username") }}" required
            >
            
        </div>
        <div>
              <label for="login_password">password</label>
            <input type="password" id="login_password" name="login_password" 
                value="{{ old("login_password") }}" required
            >

        </div>

        @error('user_login')
            <p style="color: red">{{$message}}</p>
        @enderror
        
        <input type="submit" value="Log In">
    </form>
</body>

</html>
