<x-layout>

    <h1>Edit Category</h1>

    <form action="{{ url('/categories/' . $category->id . '/update') }}" method="POST">
        @csrf 
        @method('PUT')

        <input type="text" name="name" id="name" value="{{ old('name', $category->name) }}">
        @error('name')
            <p style="color: red">{{$message}}</p>
        @enderror

        <input type="submit" value="Update">
        
    </form>


</x-layout>