<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>My Profile</title>
</head>
<body>
    @include('partials.user-nav')

    @if (session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif

    <h1>Edit Profile</h1>
    <form action="{{ url('profile') }}" method="POST">
        @csrf 
        @method('PUT')

        <label for="name">Name</label>
        <input type="text" id="name" name="name" value="{{ old('name', $user->name) }}" required>
        @error('name')
            <p style="color: red">{{$message}}</p>
        @enderror

        <button type="submit">Save Changes</button>
    </form>

    <h2>Avatar</h2>
    <img src="{{ $user->avatar ? asset('public/avatars/' . $user->avatar) : asset('public/images/placeholder.jpg') }}" alt="avatar" width="100">
    <form action="{{ url('/profile/avatar') }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <input type="file" name="avatar" required>
        @error('avatar')
            <p style="color: red">{{$message}}</p>
        @enderror
        <button type="submit">Change Avatar</button>
    </form>
    @if ($user->avatar !== NULL)
        <form action="{{ url('profile/avatar') }}" method="POST">
            @csrf
            @method('DELETE')
            <button type="submit">Remove Avatar</button>
        </form>
    @endif
</body>
</html>