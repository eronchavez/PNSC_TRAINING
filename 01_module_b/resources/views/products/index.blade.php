<x-layout>

    <h2>Products list: </h2>
    @if (session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif

    <a href="{{ url('/products/new') }}">Create new Product</a>

    @foreach ($products as $product)
        <h3><a href="{{ url('/products/' . $product->gtin) }}">{{$product->name}} {{$product->hidden ? "(Hidden)" : "(Not Hidden)"}}</a></h3>      
        <p>{{$product->gtin}}</p>  
        <p>{{$product->french_name}}</p>  
        <p>{{$product->description}}</p>  
        <p>{{$product->french_description}}</p>  
        <p>{{$product->brand}}</p>  
        <p>{{$product->country}}</p>  
        <p>{{$product->category?->name}}</p>  
        <p>{{$product->company?->name}}</p>  
        <p>{{$product->gross_weight}} {{$product->weight_unit}}</p>  
        <p>{{$product->net_weight}} {{$product->weight_unit}}</p>
        <p>{{$product->weight_unit}}</p>  
        <br> <br>
    @endforeach

</x-layout>