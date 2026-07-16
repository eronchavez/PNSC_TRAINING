<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Verify and Test GTINs</title>
</head>
<body>
    <h1>Verify GTINs</h1>

    <form action="{{ url('/verify') }}" method="POST">
        @csrf 
        <textarea name="gtins" id="gtins" cols="30" rows="10"></textarea> <br>
        @error('gtins')
            <p style="color: red">{{$message}}</p>
        @enderror
        <input type="submit" value="Verify GTINs">

    </form>
    
</body>
</html>