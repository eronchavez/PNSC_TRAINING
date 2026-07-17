<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Verify GTIN</title>
</head>
<body>
    

    <form action="{{ url('/veriffy') }}" method="POST">
        @csrf 
        <textarea name="gtins" id="gtins" cols="30" rows="10"></textarea><br>
        <input type="submit" value="verify">
    </form>

</body>
</html>