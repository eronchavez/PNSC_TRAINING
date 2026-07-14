<x-user.layout>
    
    @if (session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif

    @if ($errors->any())
        <div>
            <strong>Please fix the following: </strong>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{$error}}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <h1>User Profile</h1>
    <section>
        <h2>Edit Profile</h2>   
        <form action="{{ url('profile') }}" method="POST">
            @csrf 
            @method('PUT')

            <div class="field">
                <label for="name">Name</label>
                <input 
                    type="text"
                    id="name"
                    name="name"
                    value="{{ old('name', $user->name) }}"
                    required
                >
                @error('name')
                    <div>{{$message}}</div>
                @enderror
            </div>

            <div class="field">
                <label for="avatar">Avatar Image</label>
                <input 
                    type="text"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                >
                <div id="img-preview"></div>
                @error('avatar')
                    <p style="color: red">{{$message}}</p>
                @enderror
            </div>

            <div>
                <button type="submit">Save Changes</button>
            </div>
        </form>

        <div>
            <h3>Remove Avatar</h3>
            <form action="{{ url('profile/avatar') }}" method="POST" onsubmit="return confirm('Remove your Avatar?');">
                @csrf
                @method('DELETE')
                <button type="submit">Remove Avatar</button>
            </form>
        </div>
    </section>

    <script>

        const avatarInput = document.getElementById('avatar');
        const avatarPreview = document.getElementById('img-preview');

        avatarInput.addEventListener('change', () => {
            avatarPreview.innerHTML = '';
            const file = avatarInput.files[0];

            if(!file) return 

            const img = document.createElement('img');
            const cancelBtn = document.createElement('button');

            img.src = URL.createObjectURL('file');
            img.style.width = '200px';

            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';

            cancelBtn.onclick = () => {
                avatarInput.value = '';
                avatarPreview.innerHTML = '';
            }

            avatarPreview.append(img, cancelBtn);

        });

    </script>

</x-user.layout>