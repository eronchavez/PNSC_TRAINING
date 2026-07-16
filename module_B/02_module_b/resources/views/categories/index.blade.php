<x-layout>

    <h1>Category List: </h1>
    @if (session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif
    @if (session('warning'))
        <p style="color: red">{{session('warning')}}</p>
    @endif
    <a href="{{ url('/categories/new') }}">Create category</a>

    @foreach ($categories as $category)
        <p>{{$category->name}}</p>
        <a href="{{ url('/categories/' . $category->id) }}">Edit</a>
        <form action="{{ url('/categories/' . $category->id) }}" method="POST">
            @csrf 
            @method('DELETE')
            <input type="submit" value="Delete">
        </form>

    @endforeach


</x-layout>