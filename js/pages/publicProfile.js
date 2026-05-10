import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

window.PublicProfilePage = {
    render() {
        const uploaderName = AppState.pageData?.uploaderName || 'User';
        return `
            <div class="animate-fade-in" style="max-width: 800px;">
                <div class="flex items-center justify-between" style="margin-bottom: 2rem;">
                    <div class="flex items-center gap-4">
                        <div style="width: 60px; height: 60px; background: var(--accent-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
                            ${uploaderName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 style="margin-bottom: 0.2rem;">${uploaderName}</h1>
                            <p id="public-profile-details" style="color: var(--text-secondary); font-size: 0.9rem;">Loading details...</p>
                        </div>
                    </div>
                    <button id="public-message-btn" class="btn btn-primary">Message</button>
                </div>
                
                <div class="auth-card" style="margin-bottom: 2rem; display: none;" id="public-bio-card">
                    <h3 style="margin-bottom: 1rem;">About</h3>
                    <p id="public-bio-text" style="color: var(--text-secondary); line-height: 1.6;"></p>
                </div>
                
                <div class="auth-card">
                    <h3 style="margin-bottom: 1rem;">Uploads by ${uploaderName}</h3>
                    <div class="feed-grid" id="public-feed-grid">
                        <div style="color: var(--text-muted);">Loading notes...</div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        if (!AppState.pageData || !AppState.pageData.targetUid) {
            document.getElementById('public-feed-grid').innerHTML = '<div style="color: #ff4d4d;">User not found.</div>';
            return;
        }

        const targetUid = AppState.pageData.targetUid;
        const uploaderName = AppState.pageData.uploaderName || 'User';

        // Message button logic
        const msgBtn = document.getElementById('public-message-btn');
        if (msgBtn) {
            msgBtn.addEventListener('click', () => {
                if (!AppState.user) {
                    alert("Please log in to message this user.");
                    return;
                }
                // Save this user to active chats in localStorage
                let activeChats = JSON.parse(localStorage.getItem('activeChats') || '{}');
                if (!activeChats[AppState.user.uid]) activeChats[AppState.user.uid] = [];
                
                // Add if not already present
                if (!activeChats[AppState.user.uid].some(u => u.uid === targetUid)) {
                    activeChats[AppState.user.uid].push({ uid: targetUid, name: uploaderName });
                    localStorage.setItem('activeChats', JSON.stringify(activeChats));
                }
                
                navigateTo('chat', { targetUid, targetName: uploaderName });
            });
        }

        // Fetch user details
        try {
            const userDoc = await getDoc(doc(db, "users", targetUid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                document.getElementById('public-profile-details').innerText = `${data.course || 'Student'} • ${data.semester || ''}`;
                if (data.bio) {
                    document.getElementById('public-bio-card').style.display = 'block';
                    document.getElementById('public-bio-text').innerText = data.bio;
                }
            } else {
                document.getElementById('public-profile-details').innerText = 'Student';
            }
        } catch(e) {
            console.error(e);
            document.getElementById('public-profile-details').innerText = 'Student';
        }

        // Fetch user notes
        const feedGrid = document.getElementById('public-feed-grid');
        try {
            const q = query(collection(db, "notes"), where("uploaderId", "==", targetUid));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                feedGrid.innerHTML = '<div style="color: var(--text-muted);">No notes uploaded yet.</div>';
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
                    html += window.HomePage.renderNoteCard(
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
        } catch (error) {
            console.error("Error fetching notes: ", error);
            feedGrid.innerHTML = '<div style="color: #ff4d4d;">Failed to load notes.</div>';
        }
    }
};
