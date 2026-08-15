<x-layout>

    <h1>Product List</h1>
    @if(session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif

   @foreach ($products as $product)
        <h2><a href="{{url('/products/' . $product->gtin)}}">{{$product->name}} {{$product->hidden ? "(Hidden)" : "(Unhidden)"}}</a></h2>
        <p>{{$product->french_name}}</p>
        <p>{{$product->gtin}}</p>
        <p>{{$product->description}}</p>
        <p>{{$product->french_description}}</p>
        <p>{{$product->category?->name}}</p>
        <p>{{$product->country}}</p>
        <p>{{$product->gross_weight}} {{$product->weight_unit}}</p>
        <p>{{$product->net_weight}} {{$product->weight_unit}}</p>
        <img src="{{$product->image ? asset('public/images/' . $product->image) : asset('public/images/placeholder.jpg')}}" alt="Product Image" width="500">
   @endforeach
</x-layout>