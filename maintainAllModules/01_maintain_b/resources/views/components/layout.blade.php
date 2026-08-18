<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Product Management System</title>
</head>
<body>

    <header>
        <h1>Product Management System</h1>
        <nav>
            <ul>
                <li><a href="{{ url('/companies') }}">companies</a></li>
                <li><a href="{{ url('/products') }}">products</a></li>
                <li><a href="{{ url('/categories') }}">categories</a></li>
            </ul>
            <form action="{{ url('/logout') }}" method="POST">
                @csrf 
                <input type="submit" value="logout">
            </form>
        </nav>
    </header>

    <main>
        {{ $slot }}
    </main>
    
</body>
</html>