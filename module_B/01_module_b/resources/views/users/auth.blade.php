<x-user.layout>
    <div id="auth-container">
        <div>
            <h2>Sign Up</h2>
            <p>Register a new user account.</p>

            <form action="{{ url('user/register') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div>
                    <label for="register_name">Name</label>
                    <input type="text" id="register_name" name="name" value="{{ old('name') }}" required>
                    @error('name') <div>{{ $message }}</div> @enderror
                </div>

                <div>
                    <label for="register_avatar">Avatar Image (Optional)</label>
                    <input type="file" id="register_avatar" name="avatar" accept="image/*">
                    <div id="img-preview"></div>
                    <div>Accepts image files only.</div>
                    @error('avatar') <div>{{ $message }}</div> @enderror
                </div>

                <div>
                    <label for="register_username">Username</label>
                    <input type="text" id="register_username" name="username" value="{{ old('username') }}" required>
                    <div>Minimum 6 characters. Must contain letters and numbers.</div>
                    @error('username') <div>{{ $message }}</div> @enderror
                </div>

                <div>
                    <label for="register_password">Password</label>
                    <div>
                        <input type="password" id="register_password" name="password" required>
                        <button type="button" onclick="togglePassword('register_password', this)">Show</button>
                    </div>
                    @error('password') <div>{{ $message }}</div> @enderror
                </div>

                <button type="submit">Create Account</button>
            </form>
        </div>

        <div>
            <h2>Sign In</h2>
            <p>Login with your username and password.</p>

            <form action="{{ url('user/login') }}" method="POST">
                @csrf

                <div>
                    <label for="login_username">Username</label>
                    <input type="text" id="login_username" name="username" value="{{ old('username') }}" required>
                </div>

                <div>
                    <label for="login_password">Password</label>
                    <div>
                        <input type="password" id="login_password" name="password" required>
                        <button type="button" onclick="togglePassword('login_password', this)">Show</button>
                    </div>
                </div>

                @error('user_login')
                    <div>{{ $message }}</div>
                @enderror

                <button type="submit">Sign In</button>
            </form>
        </div>
    </div>

    <script>
        function togglePassword(inputId, button) {
            const input = document.getElementById(inputId);
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = 'Hide';
            } else {
                input.type = 'password';
                button.textContent = 'Show';
            }
        }

        // Show image preview when a file is selected
        const registerAvatarInput = document.getElementById('register_avatar');
        const registerPreview = document.getElementById('img-preview');

        registerAvatarInput.addEventListener('change', () => {
            registerPreview.innerHTML = '';
            const file = registerAvatarInput.files[0];
            if (!file) return;

            const img = document.createElement('img');
            const cancelBtn = document.createElement('button');

            img.src = URL.createObjectURL(file);
            img.style.width = '200px';

            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';

            cancelBtn.onclick = () => {
                registerAvatarInput.value = '';
                registerPreview.innerHTML = '';
            };

            registerPreview.append(img, cancelBtn);
        });
    </script>
</x-user.layout>