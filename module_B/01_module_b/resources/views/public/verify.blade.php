<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Verify GTINs</title>
</head>
<body>
    
    <h1>Verify GTINs</h1>
    <p>GTINs (one per line)</p> 
    <form action="{{ url('/verify') }}" method="POST">
        @csrf
        <textarea name="gtins" id="gtins" cols="30" rows="10" required></textarea> <br>
        <input type="submit" value="Verify GTINs">
        @error('gtins')
            <p style="color: red">{{$message}}</p>
        @enderror
    </form>

</body>
</html>