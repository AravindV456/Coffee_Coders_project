const AuthPage = {
    render() {
        const isLogin = AppState.currentPage === 'login';
        const bgImage = isLogin ? 'assets/background1.png' : 'assets/background2.png';

        return `
            <div class="auth-container animate-fade-in">
                <div class="auth-image-side" style="background-image: url('${bgImage}')"></div>
                <div class="auth-form-side">
                    <div class="auth-card">
                        <h1 class="auth-title">${isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                        <p class="auth-subtitle">${isLogin ? 'Login to access your notes' : 'Enter your details to get started'}</p>
                        
                        <form id="auth-form">
                            ${isLogin ? this.renderLoginForm() : this.renderSignupForm()}
                        </form>
                        
                        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.9rem; color: var(--text-secondary);">
                            ${isLogin ? 
                                `Don't have an account? <a href="#" id="toggle-auth">Create Account</a>` : 
                                `Already have an account? <a href="#" id="toggle-auth">Login</a>`
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderLoginForm() {
        return `
            <input type="text" id="user-id" class="input-field" placeholder="User ID" required>
            <input type="password" id="password" class="input-field" placeholder="Password" required>
            <button type="submit" class="btn btn-primary w-full" style="margin-top: 1rem;">Login</button>
        `;
    },

    renderSignupForm() {
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <input type="text" id="name" class="input-field" placeholder="Name" required>
                <input type="text" id="course" class="input-field" placeholder="Course" required>
                <input type="text" id="semester" class="input-field" placeholder="Semester" required>
                <input type="text" id="university" class="input-field" placeholder="University" required>
                <input type="text" id="scheme" class="input-field" placeholder="Scheme" required>
                <input type="text" id="user-id" class="input-field" placeholder="User ID" required>
                <input type="email" id="email" class="input-field" placeholder="Email" required>
                <input type="password" id="password" class="input-field" placeholder="Password" required>
            </div>
            <div id="otp-container" style="display: none; margin-top: 1rem;">
                <input type="text" id="otp" class="input-field" placeholder="Enter OTP sent to your email">
            </div>
            <button type="submit" id="signup-btn" class="btn btn-primary w-full" style="margin-top: 1rem;">Create Account</button>
        `;
    },

    init() {
        const form = document.getElementById('auth-form');
        const toggleLink = document.getElementById('toggle-auth');

        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(AppState.currentPage === 'login' ? 'signup' : 'login');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (AppState.currentPage === 'signup') {
                const otpContainer = document.getElementById('otp-container');
                const signupBtn = document.getElementById('signup-btn');
                
                if (otpContainer.style.display === 'none') {
                    otpContainer.style.display = 'block';
                    signupBtn.textContent = 'Verify OTP & Create Account';
                    alert('OTP sent! (Mock: 1234)');
                } else {
                    alert('Account Created Successfully!');
                    navigateTo('login');
                }
            } else {
                // Mock login
                AppState.user = {
                    id: document.getElementById('user-id').value,
                    name: 'Student Name',
                    course: 'B.Tech CSE',
                    semester: '6th',
                    scheme: '2022',
                    email: 'student@university.edu'
                };
                navigateTo('home');
            }
        });
    }
};
