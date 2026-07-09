<x-layout>


    <h2>Edit  Category: </h2>
    <form action="{{ url('/categories/' . $category->id . '/update') }}" method="POST">
        @csrf 
        @method('PUT')
        <input type="text" name="name" id="name" value="{{ $category->name }}">
        <input type="submit">
    </form>

</x-layout>