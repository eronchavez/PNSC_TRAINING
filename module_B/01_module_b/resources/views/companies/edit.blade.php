<x-layout>
    
    
    <form action="{{ url('/companies/' . $company->id . '/update') }}" method="POST">
        @csrf 
        @method("PUT")
        <label for="name">Company Name: </label>
        <input type="text" name="name" id="name" value="{{ $company->name }}"> <br> <br>
        @error('name')
            <p style="color: red">{{$message}}</p>
        @enderror
        <label for="address">Company Address: </label>
        <input type="text" name="address" id="address" value="{{ $company->address }}"> <br> <br>
        @error('address')
            <p style="color: red">{{$message}}</p>
        @enderror
        <label for="telephone">Company Telephone: </label>
        <input type="tel" name="telephone" id="telephone" value="{{ $company->telephone }}"> <br> <br>
        @error('telephone')
            <p style="color: red">{{$message}}</p>
        @enderror
        <label for="email">Company Email: </label>
        <input type="email" name="email" id="email" value="{{ $company->email }}"> <br> <br>
        @error('email')  
            <p style="color:red">{{$message}}</p>
        @enderror
        <label for="owner_name">Owner Name: </label>
        <input type="text" name="owner_name" id="owner_name" value="{{ $company->owner->name }}"> <br> <br>
        @error('owner_name')
            <p style="color: red">{{$message}}</p>
        @enderror
        <label for="owner_mobile">Owner Mobile: </label>
        <input type="number" name="owner_mobile" id="owner_mobile" value="{{ $company->owner->mobile }}"> <br><br> 
        @error('owner_mobile')
            <p style="color: red">{{$message}}</p>
        @enderror       
        <label for="owner_email">Owner Email: </label>
        <input type="email" name="owner_email" id="email" value="{{ $company->owner->email }}"> <br> <br>
        @error('owner_email')
            <p style="color: red">{{$message}}</p>
        @enderror
        <label for="contact_name">Contact Name: </label>
        <input type="text" name="contact_name" id="contact_name" value="{{$company->contact->name }}"> <br> <br>
        @error('contact_name')
            <p style="color: red">{{$message}}</p>
        @enderror
        <label for="contact_mobile">Contact Mobile: </label>
        <input type="number" name="contact_mobile" id="contact_mobile" value="{{ $company->contact->mobile }}"> <br><br> 
        @error('contact_mobile')
            <p style="color: red">{{$message}}</p>
        @enderror       
        <label for="contact_email">Contact Email: </label>
        <input type="email" name="contact_email" id="email" value="{{ $company->contact->email }}"> <br> <br>
        @error('contact_email')
            <p style="color: red">{{$message}}</p>
        @enderror

        <input type="submit" value="Update Company">

    </form>



</x-layout>
