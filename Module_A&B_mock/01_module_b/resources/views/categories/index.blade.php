<x-layout>
    <h1>Categories: </h1>
    @if (session('success'))
        <p style="color: green">{{session('success')}}</p>

    @endif
    @if (session('warning'))
        <p style="color: red">{{session('warning')}}</p>

    @endif
    <a href="{{ url('/categories/new') }}">Create new Category</a>
    @foreach ($categories as $category)
        <p>{{$category->name}}</p>
        <a href="{{ url('/categories/' . $category->id ) }}">edit</a>
        <form action="{{ url('/categories/' . $category->id) }}" method="POST">
            @csrf
            @method('DELETE')
            <input type="submit" value="delete">
        </form>
    @endforeach
</x-layout>