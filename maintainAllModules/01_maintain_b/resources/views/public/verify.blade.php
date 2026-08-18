<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Verify GTIN's</title>
</head>
<body>
    <header>
        <h1>Verify GTIN's</h1>
    </header>
    <main>
        <form action="{{ url('/result') }}" method="POST">
            @csrf
            <textarea name="gtins" id="gtins" cols="30" rows="10"></textarea>
            @error('gtins')
                <p style="color: red">{{$message}}</p>
            @enderror
            <input type="submit" value="Validate">
        </form>
    </main>
</body>
</html>