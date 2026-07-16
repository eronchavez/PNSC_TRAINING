<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Product Management System | Log In</title>
</head>
<body>
    <header>
        <h1>Log In</h1>
    </header>

    <main>
        <form action="{{ url('/login') }}" method="POST">
            @csrf 

            <input type="password" name="passphrase" placeholder="ENTER PASSPHRASE">
            <input type="submit" value="Log in">
            @error('error')
                <p style="color: red">{{$message}}</p>
            @enderror
        </form>
    </main>
    
</body>
</html>