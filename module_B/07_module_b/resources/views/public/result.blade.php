<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>GTIN result</title>
</head>
<body>

    @php
        $allValid = true;
        
        foreach ($gtins as $gtin) {
            if (!$products->contains('gtin', $gtin)) {
                # code...
                $allValid = false; 
                break;
            }
        }

    @endphp

    @if ($allValid)
        <img src="{{ asset('public/images/placeholder.jpg') }}" alt="All Check" width="200px">
        <p>All Valid</p>
    @endif

    
    <ul>
        @foreach ($gtins as $gtin)
            <li>
                GTIN: {{ $gtin }}
                @if ($products->contains('gtin', $gtin))
                    Valid 
                @else  
                    Invalid
                @endif
            </li>
        @endforeach
    </ul>
    
</body>
</html>