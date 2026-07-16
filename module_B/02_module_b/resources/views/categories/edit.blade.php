<x-layout>

    <h1>Update Category: </h1>

    <form action="{{ url('/categories/' . $category->id ) }}" method="POST">
        @csrf 
        @method('PUT')
        <input type="text" name="name" value="{{ old('name', $category->name) }}">
        <input type="submit">
        @error('name')
            <p style="color: red">{{$message}}</p>
        @enderror
    </form>

</x-layout>