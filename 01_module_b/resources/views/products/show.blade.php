<x-layout>

    <h1>Product Details</h1>
    @if(session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif

    <form action="{{ url('/products/' . $product->gtin . '/changeImage') }}"
        method="POST"
        enctype="multipart/form-data"    
    >
        @csrf 
        @method('PUT')

        <input type="file" name="image">
        <input type="submit" value="Change Image">
    </form>

     <form action="{{ url('/products/' . $product->gtin . '/removeImage') }}"
        method="POST"   
    >
        @csrf 
        @method('PUT')

       
        <input type="submit" value="Remove Image">
    </form>

    @if (!$product->hidden)
        <form action="{{ url('/products/' . $product->gtin . '/hide') }}" method="POST">
            @csrf
            @method('PUT')

            <input type="submit" value="Hide Product">
        </form>
    @else
        <form action="{{ url('/products/' . $product->gtin . '/destroy') }}" method="POST">
            @csrf
            @method('DELETE')

            <input type="submit" value="Delete Product">
        </form>
    @endif




    <h2>{{$product->name}} {{$product->hidden ? '(Hidden)' : '(Not Hidden)'}}</h1>
    <img src="{{ $product->image ? asset('public/images/' . $product->image) : 
        asset('/public/images/placeholder.jpg') }}" 
        alt={{ $product->name }}
        width="500"
    >
    <p>{{$product->french_name}}</p>
    <p>{{$product->description}}</p>
    <p>{{$product->french_description}}</p>
    <p>{{$product->gtin}}</p>
    <p>{{$product->brand}}</p>
    <p>{{$product->country}}</p>
    <p>{{$product->category?->name}}</p>
    <p>{{$product->company?->name}}</p>
    <p>{{$product->gross_weight}} {{$product->weight_unit}}</p>
    <p>{{$product->net_weight}} {{$product->weight_unit}}</p>
    <p>{{$product->weight_unit}}</p>

        
</x-layout>