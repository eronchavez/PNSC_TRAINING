<x-layout>

    <h1>Create Category</h1>
    <form action="{{ url('/categories') }}" method="POST">
        @csrf 
        <input type="text" name="name" id="name" value="{{ old('name') }}">
          @error('name')
            <p style="color: red">{{$message}}</p>
        @enderror
        <input type="submit" value="Create">
    </form>

</x-layout>