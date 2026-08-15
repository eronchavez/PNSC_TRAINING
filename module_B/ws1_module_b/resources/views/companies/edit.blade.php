<x-layout>

    <h1>Edit Company</h1>

    <form action="{{url('/companies/' . $company->id . '/update')}}" method="POST">
        @csrf 
        @method('PUT')

        <div>
            <label for="name">Company Name</label>
            <input type="text" name="name" id="name" value="{{old('name', $company->name)}}">
            @error('name')
            <p style="color: red">{{$message}}</p>
            @enderror
        </div>

          <div>
            <label for="telephone">Company telephone</label>
            <input type="text" name="telephone" id="telephone" value="{{old('telephone', $company->telephone)}}">
            @error('telephone')
            <p style="color: red">{{$message}}</p>
            @enderror
        </div>

          <div>
            <label for="email">Company email</label>
            <input type="text" name="email" id="email" value="{{old('email', $company->email)}}">
            @error('email')
            <p style="color: red">{{$message}}</p>
            @enderror
        </div>

        <div>
            <label for="address">Company address</label>
            <textarea type="text" name="address" id="address" rows="12">{{old('address', $company->address)}}</textarea>
            @error('address')
            <p style="color: red">{{$message}}</p>
            @enderror
        </div>

        <div>
            <label for="owner_name">Owner Name</label>
            <input type="text" name="owner_name" id="owner_name" value="{{old('owner_name', $company->owner->name)}}">
            @error('owner_name')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>


        <div>
            <label for="owner_mobile">Owner mobile</label>
            <input type="text" name="owner_mobile" id="owner_mobile" value="{{old('owner_mobile', $company->owner->mobile)}}">
            @error('owner_mobile')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>


        <div>
            <label for="owner_email">Owner email</label>
            <input type="email" name="owner_email" id="owner_email" value="{{old('owner_email', $company->owner->email)}}">
            @error('owner_email')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>

         <div>
            <label for="contact_name">contact Name</label>
            <input type="text" name="contact_name" id="contact_name" value="{{old('contact_name', $company->contact->name)}}">
            @error('contact_name')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>


        <div>
            <label for="contact_mobile">contact mobile</label>
            <input type="text" name="contact_mobile" id="contact_mobile" value="{{old('contact_mobile', $company->contact->mobile)}}">
            @error('contact_mobile')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>


        <div>
            <label for="contact_email">contact email</label>
            <input type="email" name="contact_email" id="contact_email" value="{{old('contact_email', $company->contact->email)}}">
            @error('contact_email')
                <p style="color: red">{{$message}}</p>
            @enderror
        </div>

        <div>
            <input type="submit" value="Update">
        </div>
    </form>

</x-layout>