<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>GTIN's Result</title>
</head>
<body>
    

    <header>
        <h1>GTIN's Result</h1>
    </header>
    <main>
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
            <img src="{{ asset('public/images/placeholder.jpg') }}" alt="Image" width="200">
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

    </main>

</body>
</html>