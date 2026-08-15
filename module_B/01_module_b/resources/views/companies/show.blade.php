<x-layout>

    <h1>Company Details: </h1>

    <a href="{{ url('/companies/' . $company->id . '/edit') }}">Edit Company</a>

    @if ($company->active)
        <form action="{{ url('/companies/' . $company->id . '/deactivate') }}" method="POST">
            @csrf 
            @method('PUT')
            <input type="submit" value="Deactivate">
        </form>
    @endif
    

    <h2>{{$company->name}} {{$company->active ? '(active)' : '(inactive)'}}</h2>
    <p>{{$company->address}}</p>
    <p>{{$company->telephone}}</p>
    <p>{{$company->email}}</p>
    <p>{{$company->owner?->name}}</p>
    <p>{{$company->owner?->mobile}}</p>
    <p>{{$company->owner?->email}}</p>
    <p>{{$company->contact?->name}}</p>
    <p>{{$company->contact?->mobile}}</p>
    <p>{{$company->contact?->email}}</p>


    @foreach ($company->products as $product)
        <h2>{{$product->name}}</h2>
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