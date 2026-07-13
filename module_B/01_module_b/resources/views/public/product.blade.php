<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Product Management System</title>
</head>
<body style="text-align: center">

    <div style="text-align: right">
        <a href="#" id="en-link">EN</a> | 
        <a href="#" id="fr-link">FR</a>
    </div>
    <h1 id="product-name">{{$product->name}}</h1>
    <h2>{{$product->company?->name}}</h2>
    <img src="{{ $product->image ? asset('public/images' . $product->image) : asset('public/images/placeholder.jpg') }}" 
        alt="{{ $product->name }}"
        width="500"
    >
    <p>{{$product->gtin}}</p>
    <p id="product-description">{{$product->description}}</p>
    <p>Weight: {{$product->gross_weight}} {{$product->weight_unit}}</p>
    <p>Net Content Weight: {{$product->net_weight}} {{$product->weight_unit}}</p>
    <p>Category: {{$product->category?->name}}</p>
    
    <script>
        let lang = 'en';

        document.getElementById('en-link').addEventListener('click', function(e){
            e.preventDefault();
            lang = 'en';
            updateContent();
        });

        document.getElementById('fr-link').addEventListener('click', function(e){
            e.preventDefault();
            lang = 'fr';
            updateContent();
        });


        function updateContent()
        {
            document.getElementById('product-name').textContent = lang === 'en' ? '{{ $product->name }}' : '{{ $product->french_name }}';
            document.getElementById('product-description').textContent = lang === 'en' ? '{{ $product->description }}' : '{{ $product->french_description }}';
        }
    </script>
</body>
</html>