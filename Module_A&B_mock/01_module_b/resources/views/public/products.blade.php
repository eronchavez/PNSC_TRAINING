<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Public Product Management System</title>
</head>
<body>
    
    <h1>Public Product Management System</h1>
    <p>filter</p>
    <form action="{{ url('/') }}" method="GET">
        <select name="category" id="category">
            @foreach ($categories as $category)
                <option value="{{ $category->id }}">{{$category->name}}</option>
            @endforeach
        </select>
        <input type="submit" value="Filter">
    </form>
    <form action="{{ url('/') }}" method="GET">
        <select name="company" id="company">
            @foreach ($companies as $company)
                <option value="{{ $company->id }}">{{$company->name}}</option>
            @endforeach
        </select>
        <input type="submit" value="Filter">
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
                <th>{{$product->gtin}}</th>
                <th>
                    <a href="{{ url('01/' . $product->gtin) }}">{{$product->name}}</a>
                </th>
                <th>{{$product->company?->name}}</th>
                <th>{{$product->category?->name}}</th>
             </tr>
            @endforeach
       
    </table>
</body>
</html>