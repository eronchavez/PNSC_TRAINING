<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Public Product Management System</title>
</head>
<body>
    @include('partials.user-nav')
    
    <header>
        <h1>Public Product Management System</h1>
    </header>
    <main>
        <h2>Filter</h2>
        <form action="{{ url("/") }}" method="GET">
            <select name="company_id" id="company_id">
                @foreach ($companies as $company)
                    <option value="{{ $company->id }}">{{ $company->name }}</option>
                @endforeach
            </select>
             <button type="submit">Filter</button>
        </form> <br> <br>
        <form action="{{ url("/") }}" method="GET">
            <select name="category_id" id="category_id">
                @foreach ($categories as $category)
                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                @endforeach
            </select>
             <button type="submit">Filter</button>
        </form>



        <table border="1">
            <tr>
                <th>GTIN</th>
                <th>Product Name</th>
                <th>Company</th>
                <th>Product</th>
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
    </main>
    


</body>
</html>