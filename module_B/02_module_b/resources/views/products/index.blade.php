<x-layout>

    <h1>Products List: </h1>
    @if (session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif

    <a href="{{ url('/products/new') }}">Create new product</a>

    @foreach ($products as $product)
        <h2><a href="{{ url('/products/' . $product->gtin) }}">{{$product->name}} {{$product->hidden ? '(hidden)' : '(unhidden)'}}</a></h2>
        <p>{{$product->french_name}}</p>
        <p>{{$product->gtin}}</p>
        <p>{{$product->description}}</p>
        <p>{{$product->french_description}}</p>
        <p>{{$product->brand}}</p>
        <p>{{$product->category?->name}}</p>
        <p>{{$product->country}}</p>
        <p>{{$product->gross_weight}} {{$product->weight_unit}}</p>
        <p>{{$product->net_weight}} {{$product->weight_unit}}</p>
    @endforeach

</x-layout>