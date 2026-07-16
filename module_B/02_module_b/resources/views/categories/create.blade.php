<x-layout>

    <h1>Create Category: </h1>

    <form action="{{ url('/categories') }}" method="POST">
        @csrf 
        <input type="text" name="name">
        <input type="submit">
        @error('name')
            <p style="color: red">{{$message}}</p>
        @enderror
    </form>

</x-layout>