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
    </header>

    <nav>
        <ul>
            @auth
                <li><a href="{{ url('/') }}">Products</a></li>
                <li>
                    <a href="{{ url('profile') }}">
                        <img src="{{ Auth::user()->avatar ? asset(Auth::user()->avatar) : asset('public/images/plaholder.jpg')  }}" 
                            alt="Avatar"
                            class="avatar"
                            style="width: 40px; height: 40px; border-radius: 50%"
                        />
                        {{ Auth::user()->name }}
                    </a>
                </li>
                <li><a href="#" onclick="event.preventDefault();document.getElementById('logoutForm').submit()">Logout</a></li>
            @endauth
            @guest
                <li><a href="{{ url('user/auth') }}">Register or Login</a></li>
            @endguest

        </ul>
    </nav>

    <form action="{{ url('user/logout') }}" method="POST" id="logoutForm">
        @csrf
    </form>

    <main>
        {{ $slot }}
    </main>
    
</body>
</html>