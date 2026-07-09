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
    <form action="{{ url('/verify') }}" method="POST">
        @csrf 
        <label for="gtins">GTINs (one per line): </label> <br>
        <textarea name="gtins" id="gtins" cols="30" rows="10" required></textarea> <br>
        <input type="submit" value="Verify GTINs">
    </form>
    
</body>
</html>