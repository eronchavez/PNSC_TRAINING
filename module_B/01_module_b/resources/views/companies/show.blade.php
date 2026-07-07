<x-layout>
    @if ($company->active)
      <form action="{{ url('/companies/' . $company->id . '/deactivate') }}" method="POST"> 
        @method("PUT")
        @csrf
        <input type="submit" value="Deactivate">
      </form>
    @endif

    <a href="{{ url('/companies/' . $company->id . '/edit') }}">Edit Company</a>
    <h4>{{$company->name}}</h4>
    <p>{{$company->address}}</p>
    <p>{{$company->email}}</p>

    @foreach ($company->products as $product)
        <p>{{$product->name}}</p>    
        <p>{{$product->french_name}}</p>    
        <p>{{$product->gtin}}</p>    
        <p>{{$product->description}}</p>    
        <p>{{$product->french_description}}</p>    
        <p>{{$product->brand}}</p>    
        <p>{{$product->category?->name}}</p>    
        <p>{{$product->country}}</p>    
        <p>{{$product->gross_weight }} {{$product->weight_unit}}</p>    
        <p>{{$product->net_weight}} {{$product->weight_unit}}</p>    
        <p>{{$product->weight_unit}}</p>   
        <br> <br> 
    @endforeach

</x-layout>