<x-layout>  

    <h2>Company Details: </h2>

    <a href="{{ url('/companies/' . $company->id . '/edit') }}">Edit</a>

    @if ($company->active)
        <form action="{{ url('/companies/' . $company->id . '/deactivate') }}" method="POST">
            @csrf 
            @method('PUT')
            <input type="submit" value="Deactivate">
        </form> 
    @endif

    <h3>{{$company->name}}</h3>
    <p>{{$company->address}}</p>
    <p>{{$company->telephone}}</p>
    <p>{{$company->email}}</p>


    @foreach ($company->products as $product )
        <h3>{{ $product->name }} {{$product->hidden ? "(hidden)" : "(unhidden)"}}</h3>
        <p>{{$product->french_name}}</p>
        <p>{{$product->gtin}}</p>
        <p>{{$product->description}}</p>
        <p>{{$product->french_description}}</p>
        <p>{{$product->brand}}</p>
        <p>{{$product->category?->name}}</p>
        <p>{{$product->country}}</p>
        <p>{{$product->gross_weight}} {{$product->weight_unit}}</p>
        <p>{{$product->net_weight}} {{$product->weight_unit}}</p>
        <img src="{{$product->image ? asset('public/images/' . $product->image) : asset('public/images/placeholder.jpg')}}" alt="{{ $product->image }}" width="500">
    @endforeach
</x-layout>