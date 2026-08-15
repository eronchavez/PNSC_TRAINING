<x-layout>

    <h1>Create new Product</h1>

    <form action="{{ url('/products') }}" method="POST" enctype="multipart/form-data">
        @csrf 
        <div>
            <label for="name">name: </label>
            <input type="text" name="name" id="name" value="{{ old('name') }}">
            @error('name')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
            <label for="french_name">french_name: </label>
            <input type="text" name="french_name" id="french_name" value="{{ old('french_name') }}">
            @error('french_name')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
            <label for="description">description</label>
            <textarea name="description" id="description" cols="30" rows="10">{{old('description')}}</textarea>
            @error('description')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
            <label for="french_description">french_description</label>
            <textarea name="french_description" id="french_description" cols="30" rows="10">{{old('french_description')}}</textarea>
            @error('french_description')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
         <div>
            <label for="gtin">gtin: </label>
            <input type="number" name="gtin" id="gtin" value="{{ old('gtin') }}">
            @error('gtin')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
         <div>
            <label for="brand">brand: </label>
            <input type="text" name="brand" id="brand" value="{{ old('brand') }}">
            @error('brand')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
         <div>
            <label for="country">country: </label>
            <input type="text" name="country" id="country" value="{{ old('country') }}">
            @error('country')
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
            <label for="gross_weight">gross_weight</label>
            <input type="number" name="gross_weight" id="gross_weight" step="any" value="{{ old('gross_weight') }}">
            @error('gross_weight')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
            <label for="net_weight">net_weight</label>
            <input type="number" name="net_weight" id="net_weight" step="any" value="{{ old('net_weight') }}">
            @error('net_weight')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>
        <div>
            <label for="weight_unit">weight_unit</label>
            <input type="text" name="weight_unit" id="weight_unit" value="{{ old('weight_unit') }}">
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
            <label for="image">Image</label>
            <input type="file" name="image" id="image">
            <div id="img-preview"></div>
        </div>

        <div>
            <input type="submit" value="Create Product">
        </div>
        
    </form>

    <script>
        let input = document.getElementById('image');
        let preview = document.getElementById('img-preview');

        input.onchange = (e) => {
            e.preventDefault();
            preview.innerHTML = "";

            const file = input.files[0];
            if(!file) return; 

            const img = document.createElement('img');
            const cancelBtn = document.createElement('button');

            img.src = URL.createObjectURL(file);
            img.style.width = '200px';

            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => {
                input.value = '';
                preview.innerHTML = "";
            }
        
            preview.append(img,cancelBtn);
            
        }
    </script>

</x-layout>