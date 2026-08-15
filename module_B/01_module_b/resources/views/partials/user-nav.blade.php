@auth
    <div>
        <img src="{{ Auth::user()->avatar ? asset('public/avatars/' . Auth::user()->avatar) : asset('images/placeholder.jpg') }}" 
        alt="Avatar" width="32" height="32" style="border-radius: 50%">
        <a href="{{ url('profile') }}">{{Auth::user()->name}}</a>
        <form action="{{ url('/user/logout') }}" method="POST">
            @csrf 
            <button type="submit">Logout</button>
        </form>
    </div>
@endauth

@guest
    <a href="{{ url("/user/auth") }}">Register or Log In</a>
@endguest