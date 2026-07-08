<x-layout>

        <h1>Category List: </h1>
        @if (session('success'))
            <p style="color: green">{{session('success')}}</p>
        @endif
        @if (session('warning'))
            <p style="color: red">{{session('warning')}}</p>
        @endif
        <a href="{{ url('/categories/new') }}">Create new Category</a>
        @foreach ($categories as $category)
            <h2>{{$category->name}}</h2>
            <a href="{{ url('/categories/' . $category->id . '/edit') }}">Edit</a>
            <form action="{{ url('/categories/' . $category->id . '/destroy') }}" method="POST">
                @csrf
                @method('DELETE')
                <input type="submit" value="Delete Category">
            </form>
        @endforeach

</x-layout>