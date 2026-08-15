<x-layout>

    <h1>Company Details: </h1>

    <a href="{{url('/companies/' . $company->id . '/edit')}}">Edit Company</a>
    @if($company->active)
        <form action="{{url('/companies/' . $company->id . '/deactivate')}}" method="POST">
            @csrf 
            @method('DELETE')
            <input type="submit" value="Deactivate">
        </form>
    @endif

    <h2>{{$company->name}} {{$company->active ? "Active" : "Inactive"}}</h2>
    <p>{{$company->address}}</p>
    <p>{{$company->telephone}}</p>
    <p>{{$company->email}}</p>

    @foreach ($company->products as $product)
        <h3>{{$product->name}}</h3>
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