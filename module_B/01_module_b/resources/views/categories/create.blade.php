<x-layout>

    <h1>Create new Category</h1>
    <form action="{{ url('/categories') }}" method="POST">
        @csrf
        <input type="text" name="name">
        @error('name')
            <p style="color: red">{{$message}}</p>
        @enderror
        <input type="submit" value="create">
    </form>
</x-layout>