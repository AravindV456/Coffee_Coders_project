import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

window.ProfilePage = {
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
                
                <div class="auth-card" style="margin-top: 2rem;">
                    <h3 style="margin-bottom: 1rem;">My Uploads</h3>
                    <div class="feed-grid" id="profile-feed-grid">
                        <div style="color: var(--text-muted);">Loading your uploads...</div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderNoteCard(id, title, topic, type, views, uploader, uploaderId, upvotedBy = [], downvotedBy = [], viewedBy = [], fileUrl = '#') {
        const typeClass = type ? type.toLowerCase().replace(' ', '-') : 'notes';
        const upvotes = upvotedBy.length;
        const downvotes = downvotedBy.length;
        const totalViews = viewedBy.length > 0 ? viewedBy.length : (views || 0);
        const uid = AppState.user ? AppState.user.uid : null;
        const isUpvoted = uid && upvotedBy.includes(uid);
        const isDownvoted = uid && downvotedBy.includes(uid);
        const isOwner = uid === uploaderId;
        
        return `
            <div class="note-card" style="cursor: pointer;" onclick="window.handleViewAndOpen('${id}', '${fileUrl}', '${title.replace(/'/g, "\\'")}', '${topic.replace(/'/g, "\\'")}', '${uploader.replace(/'/g, "\\'")}')">
                <div class="flex justify-between items-start" style="margin-bottom: 1rem;">
                    <span class="tag tag-${typeClass}">${type || 'Notes'}</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${totalViews} views</span>
                </div>
                <h3 style="margin-bottom: 0.5rem; font-size: 1.1rem;">${title}</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${topic}</p>
                <p style="color: var(--text-muted); font-size: 0.8rem; cursor: pointer; display: inline-block;" onclick="event.stopPropagation(); navigateTo('publicProfile', {targetUid: '${uploaderId}', uploaderName: '${uploader}'})"><b>${uploader}</b></p>
                
                <div class="card-actions">
                    <button class="action-btn" style="color: ${isUpvoted ? 'var(--accent-primary)' : 'inherit'};" onclick="window.handleVote('${id}', 'up', event)">${Icons.ArrowUp()} <span>${upvotes}</span></button>
                    <button class="action-btn" style="color: ${isDownvoted ? '#ff4d4d' : 'inherit'};" onclick="window.handleVote('${id}', 'down', event)">${Icons.ArrowDown()} <span>${downvotes}</span></button>
                    ${isOwner ? `<button class="action-btn" style="color: #ff4d4d; margin-left: auto;" onclick="window.handleDelete('${id}', event)">${Icons.Trash()} <span style="margin-left: 4px;">Delete</span></button>` : ''}
                </div>
            </div>
        `;
    },

    async init() {
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
                // We'd typically update Firestore here, keeping it mock for now
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
        
        const feedGrid = document.getElementById('profile-feed-grid');
        if (feedGrid && AppState.user && AppState.user.uid) {
            try {
                const q = query(collection(db, "notes"), where("uploaderId", "==", AppState.user.uid));
                getDocs(q).then(querySnapshot => {
                    if (querySnapshot.empty) {
                        feedGrid.innerHTML = '<div style="color: var(--text-muted);">You haven\'t uploaded any notes yet.</div>';
                    } else {
                        let html = '';
                        let notes = [];
                        querySnapshot.forEach((doc) => {
                            notes.push({ id: doc.id, ...doc.data() });
                        });
                        notes.sort((a, b) => {
                            const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
                            const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
                            return timeB - timeA;
                        });
                        notes.forEach((data) => {
                            html += this.renderNoteCard(
                                data.id,
                                data.subject,
                                data.topic,
                                data.category,
                                data.views,
                                data.uploaderName,
                                data.uploaderId,
                                data.upvotedBy || [],
                                data.downvotedBy || [],
                                data.viewedBy || [],
                                data.fileUrl
                            );
                        });
                        feedGrid.innerHTML = html;
                    }
                });
            } catch (error) {
                console.error("Error fetching user notes: ", error);
                feedGrid.innerHTML = '<div style="color: #ff4d4d;">Failed to load your notes.</div>';
            }
        }
    }
};
