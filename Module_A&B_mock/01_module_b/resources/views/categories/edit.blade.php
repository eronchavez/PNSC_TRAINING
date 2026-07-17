<x-layout>

    <h1>Update Category</h1>
    <form action="{{ url('/categories/' . $category->id) }}" method="POST">
        @csrf
        @method('PUT')
        <input type="text" name="name">
        @error('name')
            <p style="color: red">{{$message}}</p>
        @enderror
        <input type="submit" value="update">
    </form>
</x-layout>