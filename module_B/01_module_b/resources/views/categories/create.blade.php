<x-layout>


    <h2>Create new Category: </h2>
    <form action="{{ url('/categories') }}" method="POST">
        @csrf 
        <input type="text" name="name" id="name">
        @error('name')
            <p style="color: red">{{$message}}</p>
        @enderror
        <input type="submit">
    </form>

</x-layout>