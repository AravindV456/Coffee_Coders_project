const ProfilePage = {
    render() {
        const u = AppState.user || { id: 'N/A', name: 'N/A', course: 'N/A', email: 'N/A', semester: 'N/A', scheme: 'N/A', bio: '' };
        const isEditing = AppState.isEditingProfile || false;

        return `
            <div class="animate-fade-in" style="max-width: 800px;">
                <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
                    <h1>Student Profile</h1>
                    <button id="edit-profile-btn" class="btn btn-primary">
                        ${isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>
                
                <form id="profile-form">
                    <div class="auth-card" style="margin-bottom: 2rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                            <div>
                                <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">User ID</label>
                                ${isEditing ? 
                                    `<input type="text" id="edit-id" class="input-field" value="${u.id}" disabled>` : 
                                    `<p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.id}</p>`
                                }
                                
                                <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Full Name</label>
                                ${isEditing ? 
                                    `<input type="text" id="edit-name" class="input-field" value="${u.name}" required>` : 
                                    `<p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.name}</p>`
                                }
                                
                                <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Course</label>
                                ${isEditing ? 
                                    `<input type="text" id="edit-course" class="input-field" value="${u.course}" required>` : 
                                    `<p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.course}</p>`
                                }
                            </div>
                            <div>
                                <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Email Address</label>
                                ${isEditing ? 
                                    `<input type="email" id="edit-email" class="input-field" value="${u.email}" required>` : 
                                    `<p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.email}</p>`
                                }
                                
                                <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Semester</label>
                                ${isEditing ? 
                                    `<input type="text" id="edit-semester" class="input-field" value="${u.semester}" required>` : 
                                    `<p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.semester}</p>`
                                }
                                
                                <label style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Scheme</label>
                                ${isEditing ? 
                                    `<input type="text" id="edit-scheme" class="input-field" value="${u.scheme}" required>` : 
                                    `<p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${u.scheme}</p>`
                                }
                            </div>
                        </div>
                    </div>
                    
                    <div class="auth-card">
                        <h3 style="margin-bottom: 1rem;">Additional Information</h3>
                        <textarea id="edit-bio" class="input-field" style="min-height: 120px; resize: vertical;" placeholder="Add some details about yourself..." ${!isEditing ? 'disabled' : ''}>${u.bio || ''}</textarea>
                        ${isEditing ? `<button type="submit" class="btn btn-primary w-full">Save Changes</button>` : ''}
                    </div>
                </form>
            </div>
        `;
    },
    init() {
        const editBtn = document.getElementById('edit-profile-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                AppState.isEditingProfile = !AppState.isEditingProfile;
                renderApp();
            });
        }

        const form = document.getElementById('profile-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                AppState.user = {
                    ...AppState.user,
                    name: document.getElementById('edit-name').value,
                    course: document.getElementById('edit-course').value,
                    email: document.getElementById('edit-email').value,
                    semester: document.getElementById('edit-semester').value,
                    scheme: document.getElementById('edit-scheme').value,
                    bio: document.getElementById('edit-bio').value
                };
                AppState.isEditingProfile = false;
                alert('Profile updated successfully!');
                renderApp();
            });
        }
    }
};
