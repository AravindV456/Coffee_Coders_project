import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

window.AuthPage = {
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
            <input type="email" id="login-email" class="input-field" placeholder="Email" required>
            <input type="password" id="login-password" class="input-field" placeholder="Password" required>
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

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (AppState.currentPage === 'signup') {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const name = document.getElementById('name').value;
                const course = document.getElementById('course').value;
                const semester = document.getElementById('semester').value;
                const university = document.getElementById('university').value;
                const scheme = document.getElementById('scheme').value;
                const userId = document.getElementById('user-id').value;
                
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    
                    // Save user info to Firestore
                    await setDoc(doc(db, "users", user.uid), {
                        id: userId,
                        name: name,
                        course: course,
                        semester: semester,
                        university: university,
                        scheme: scheme,
                        email: email
                    });
                    
                    try {
                        await sendEmailVerification(user);
                        alert('Account Created Successfully! Please check your email to verify your account before logging in.');
                    } catch (emailError) {
                        console.error('Email verification error:', emailError);
                        alert('Account created, but failed to send verification email. You can resend it by trying to log in.');
                    }
                    
                    navigateTo('login');
                } catch (error) {
                    alert('Error signing up: ' + error.message);
                }
            } else {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    
                    await user.reload();
                    
                    if (!user.emailVerified) {
                        const resend = confirm('Please verify your email address before logging in. Check your inbox/spam folder. Click OK if you want us to resend the verification email.');
                        if (resend) {
                            try {
                                await sendEmailVerification(user);
                                alert('Verification email resent! Please check your inbox.');
                            } catch (e) {
                                alert('Failed to resend email: ' + e.message);
                            }
                        }
                        await signOut(auth);
                        return;
                    }
                    
                    // Get user info from Firestore
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        AppState.user = { uid: user.uid, ...userDoc.data() };
                    } else {
                        AppState.user = { uid: user.uid, email: user.email, name: 'User', id: 'N/A', course: 'N/A', semester: 'N/A', scheme: 'N/A' };
                    }
                    
                    navigateTo('home');
                } catch (error) {
                    alert('Error logging in: ' + error.message);
                }
            }
        });
    }
};
