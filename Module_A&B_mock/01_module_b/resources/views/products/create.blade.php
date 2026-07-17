<x-layout>

    <h1>Create Product</h1>

    <form action="{{ url('/products') }}" method="POST">
        @csrf

        <div>
            <label for="name">name</label>
            <input type="text" name="name" value="{{ old('name') }}">
            @error('name')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>

        <div>
            <label for="french_name">french_name</label>
            <input type="text" name="french_name" value="{{ old('french_name') }}">
            @error('french_name')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
            <label for="gtin">gtin</label>
            <input type="number" name="gtin" value="{{ old('gtin') }}">
            @error('gtin')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
            <label for="description">description</label>
            <input type="text" name="description" value="{{ old('description') }}">
            @error('description')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
            <label for="french_description">french_description</label>
            <input type="text" name="french_description" value="{{ old('french_description') }}">
            @error('french_description')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
            <label for="brand">brand</label>
            <input type="text" name="brand" value="{{ old('brand') }}">
            @error('brand')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
            <select name="category_id" id="category_id">
                @foreach ($categories as $category)
                    <option value="{{ $category->id }}">{{$category->name}}</option>
                @endforeach    
            </select>
        </div>
        <div>
             <label for="country">country</label>
            <input type="text" name="country" value="{{ old('country') }}">
            @error('country')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
             <label for="gross_weight">gross_weight</label>
            <input type="number" name="gross_weight" value="{{ old('gross_weight') }}" step="any">
            @error('gross_weight')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
             <label for="net_weight">net_weight</label>
            <input type="number" name="net_weight" value="{{ old('net_weight') }}" step="any">
            @error('net_weight')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
             <label for="weight_unit">weight_unit</label>
            <input type="text" name="weight_unit" value="{{ old('weight_unit') }}" >
            @error('weight_unit')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
         <div>
            <select name="company_id" id="company_id">
                @foreach ($companies as $company)
                    <option value="{{ $company->id }}">{{$company->name}}</option>
                @endforeach    
            </select>
        </div>
        <div>
            <input type="file" name="image" id="image">
            <div id="img-preview"></div>
        </div>

        <input type="submit" value="Create Product">
    </form>


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