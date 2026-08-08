<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Public Product Verify GTIN Result</title>
</head>
<body>

    @php
        
        $allValid = true;

        foreach($gtins as $gtin)
        {
            if(!$products->contains('gtin', $gtin))
            {
                $allValid = false;
                break;
            }
        }

    @endphp

    @if ($allValid)
        <img src="{{ asset('public/images/green-tick.png') }}" 
            alt="{{ "Check Mark" }}"
            width="100"
        />
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