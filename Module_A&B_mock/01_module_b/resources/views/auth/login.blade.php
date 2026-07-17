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
        <h1>Log in</h1>
    </header>

    <main>
        <form action="{{ url('/login') }}" method="POST">
            @csrf
            <input type="password" name="passphrase" id="passphrase">
            @error('error')
                <p style="color: red">{{$message}}</p>
            @enderror
            <input type="submit" value="Log In">
        </form>
    </main>
    
</body>
</html>