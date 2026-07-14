<x-layout>

    <h1>Product Details</h1>
    @if(session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif

    <form action="{{ url('/products/' . $product->gtin . '/changeImage') }}"
        method="POST"
        enctype="multipart/form-data"    
    >
        @csrf 
        @method('PUT')

        <input type="file" name="image" id="image">
        <div id="img-preview"></div>
        <input type="submit" value="Change Image">
        @error('image')
            <p style="color: red">{{$message}}</p>
        @enderror
    </form>

     <form action="{{ url('/products/' . $product->gtin . '/removeImage') }}"
        method="POST"   
    >
        @csrf 
        @method('PUT')

        <input type="submit" value="Remove Image">
    </form>

    @if (!$product->hidden)
        <form action="{{ url('/products/' . $product->gtin . '/hide') }}" method="POST">
            @csrf
            @method('PUT')

            <input type="submit" value="Hide Product">
        </form>
    @else
        <form action="{{ url('/products/' . $product->gtin . '/destroy') }}" method="POST">
            @csrf
            @method('DELETE')

            <input type="submit" value="Delete Product">
        </form>
    @endif

    <h2>{{$product->name}} {{$product->hidden ? '(Hidden)' : '(Not Hidden)'}}</h2>
    <img src="{{ $product->image ? asset('public/images/' . $product->image) : 
        asset('/public/images/placeholder.jpg') }}" 
        alt="{{ $product->name }}"
        width="500"
    >
    <p>{{$product->french_name}}</p>
    <p>{{$product->description}}</p>
    <p>{{$product->french_description}}</p>
    <p>{{$product->gtin}}</p>
    <p>{{$product->brand}}</p>
    <p>{{$product->country}}</p>
    <p>{{$product->category?->name}}</p>
    <p>{{$product->company?->name}}</p>
    <p>{{$product->gross_weight}} {{$product->weight_unit}}</p>
    <p>{{$product->net_weight}} {{$product->weight_unit}}</p>
    <p>{{$product->weight_unit}}</p>
    <p>{{ $reviewCount ? number_format($avgRating, 1) . '/5' : 'No ratings yet' }}</p>
    <p>{{ $reviewCount }} {{ Str::plural('review', $reviewCount) }}</p>

    <hr>

    <h2>Reviews</h2>

    @auth
        <form action="{{ url('01/' . $product->gtin . '/reviews') }}" method="POST">
            @csrf
            <input type="number" name="rating" min="1" max="5" placeholder="Rating (1-5)" value="{{ old('rating') }}" required>
            @error('rating') <p style="color: red">{{ $message }}</p> @enderror

            <textarea name="review" maxlength="200" placeholder="Write a review (max 200 chars)">{{ old('review') }}</textarea>
            @error('review') <p style="color: red">{{ $message }}</p> @enderror

            <input type="submit" value="Submit Review">
        </form>
    @else
        <p><a href="{{ url('user/auth') }}">Log in</a> to write a review.</p>
    @endauth

    <ul>
        @forelse ($product->reviews as $review)
            <li>{{ $review->user->name }} — {{ $review->rating }}/5: {{ $review->review }}</li>
        @empty
            <li>No reviews yet.</li>
        @endforelse
    </ul>

    <script>
        // Show image preview when a file is selected
        const input = document.getElementById('image');
        const preview = document.getElementById('img-preview');

        input.addEventListener('change', () => {
            preview.innerHTML = '';
            const file = input.files[0];
            if (!file) return;

            const img = document.createElement('img');
            const cancelBtn = document.createElement('button');

            img.src = URL.createObjectURL(file);
            img.style.width = '200px';

            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';

            cancelBtn.onclick = () => {
                input.value = '';
                preview.innerHTML = '';
            };

            preview.append(img, cancelBtn);
        });
    </script>

</x-layout>