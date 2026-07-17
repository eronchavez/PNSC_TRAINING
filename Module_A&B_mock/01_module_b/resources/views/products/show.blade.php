<x-layout>


    <h1>Product Details</h1>
    @if (session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif
  
    <form action="{{ url('/products/' . $product->gtin . '/changeImage') }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <input type="file" name="image" id="image">
        <div id="img-preview"></div>
        <input type="submit" value="Change Image">
    
    </form>

    <form action="{{ url('/products/' . $product->gtin . '/removeImage') }}" method="POST"">
        @csrf
        @method('PUT')
        <input type="submit" value="Remove Image">
    </form>

    @if (!$product->hidden)
        <form action="{{ url('/products/' . $product->gtin . '/hide') }}" method="POST">
            @csrf
            @method('PUT')

            <input type="submit" value="Hide">
        </form>
    @else 
        <form action="{{ url('/products/' . $product->gtin . '/destroy') }}" method="POST">
            @csrf
            @method('DELETE')

            <input type="submit" value="Delete Product">
        </form>
    @endif





        <h2>{{$product->name}} {{$product->hidden ? '(hidden)' : '(unhidden)'}}</h2>
        <p>{{$product->french_name}}</p>
        <p>{{$product->gtin}}</p>
        <p>{{$product->description}}</p>
        <p>{{$product->french_description}}</p>
        <p>{{$product->brand}}</p>
        <p>{{$product->category?->name}}</p>
        <p>{{$product->gross_weight}} {{$product->weight_unit}}</p>
        <p>{{$product->net_weight}} {{$product->weight_unit}}</p>
        <img src="{{ $product->image ? asset('public/images/'. $product->image) : asset('public/images/placeholder.jpg') }}"
            alt="{{ $product->name}}"
            width="500"
        >

        
   <script>
let input = document.getElementById('image');
let preview = document.getElementById('img-preview');
input.addEventListener('change', () => {
    preview.innerHTML = ''; // Clear previous content immediately
    const file = input.files[0];
    if(!file) return;
    
    let img = document.createElement('img');
    let cancelBtn = document.createElement('button');
    
    // Use FileReader to handle the file as a Data URL for maximum compatibility
    const reader = new FileReader();
    reader.onload = (e) => {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    img.style.width = '200px';
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    
    cancelBtn.onclick = () => {
        input.value = '';
        preview.innerHTML = '';
    };

    // Append the image and cancel button to the preview area
    preview.append(img, cancelBtn);
});
</script>


</x-layout>