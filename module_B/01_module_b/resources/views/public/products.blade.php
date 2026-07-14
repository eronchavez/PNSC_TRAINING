<x-user.layout>

    
    <h1>Public Products</h1>
    <p>Filter</p>
    <form action="{{ url('/') }}" method="GET">
        <label for="company">By Company</label>
        <select name="company" id="company">
            @foreach ($companies as $company)
                <option value="{{ $company->id }}">{{$company->name}}</option>
            @endforeach
            <input type="submit" value="Filter">
        </select> 
    </form>
    <form action="{{ url('/') }}" method="GET">
        <label for="category">By Category</label>
        <select name="category" id="category">
            @foreach ($categories as $category)
                <option value="{{ $category->id }}">{{$category->name}}</option>
            @endforeach
            <input type="submit" value="Filter">
        </select> 
    </form>

    <table border="1">
        <tr>
            <th>GTIN</th>
            <th>Product Name</th>
            <th>Company</th>
            <th>Category</th>
        </tr>
        @foreach ($products as $product)
            <tr>
                <td>{{$product->gtin}}</td>
                <td>
                    <a href="{{ url('01/' . $product->gtin) }}">{{$product->name}}</a>
                </td>
                <td>{{$product->company?->name}}</td>
                <td>{{$product->category?->name}}</td>
            </tr>
        @endforeach
    </table>


</x-user.layout>