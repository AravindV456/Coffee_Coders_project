const ProfilePage = {
    render() {
        const u = AppState.user || { id: 'N/A', name: 'N/A', course: 'N/A', email: 'N/A', semester: 'N/A', scheme: 'N/A' };
        return `
            <div class="animate-fade-in" style="max-width: 800px;">
                <h1 style="margin-bottom: 2rem;">Student Profile</h1>
                
                <div class="auth-card" style="margin-bottom: 2rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div>
                            <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">User ID</label>
                            <p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.id}</p>
                            
                            <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Full Name</label>
                            <p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.name}</p>
                            
                            <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Course</label>
                            <p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.course}</p>
                        </div>
                        <div>
                            <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Email Address</label>
                            <p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.email}</p>
                            
                            <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Semester</label>
                            <p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.semester}</p>
                            
                            <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Scheme</label>
                            <p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.scheme}</p>
                        </div>
                    </div>
                </div>
                
                <div class="auth-card">
                    <h3 style="margin-bottom: 1rem;">Additional Information</h3>
                    <textarea class="input-field" style="min-height: 120px; resize: vertical;" placeholder="Add some details about yourself (interests, specialization, etc.)"></textarea>
                    <button class="btn btn-primary">Save Information</button>
                </div>
            </div>
        `;
    },
    init() {}
};
