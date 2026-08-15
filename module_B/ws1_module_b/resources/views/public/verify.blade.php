<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Verify GTINS</title>
</head>
<body>

    <h1>Verify GTINS</h1>
    <form action="{{ url('/result') }}" method="POST">
        @csrf 
        <textarea name="gtins" id="gtins" cols="30" rows="10"></textarea>
        <input type="submit" value="Validate"/>
    </form>
    
</body>
</html>