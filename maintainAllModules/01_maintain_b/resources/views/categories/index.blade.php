<x-layout>


    <h1>Category List: </h1>
    <a href="{{url('/categories/new')}}">Create new Category</a>
    @if (session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif
    @if (session('warning'))
        <p style="color: red">{{session('warning')}}</p>
    @endif

    @foreach ($categories as $category)
        <h3>{{$category->name}}</h3>
        <a href="{{ url('/categories/' . $category->id . '/edit') }}">Edit</a>
        <form action="{{ url('/categories/' . $category->id . '/destroy') }}" method="POST">
            @csrf 
            @method('DELETE')
            <input type="submit" value="Delete">
        </form>
    @endforeach

</x-layout>
