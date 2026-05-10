import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase.js";

window.HomePage = {
    render() {
        return `
            <div class="animate-fade-in">

                <section style="margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Recent Uploads</h2>
                    <div class="feed-grid" id="home-feed-grid">
                        <div style="color: var(--text-muted);">Loading notes...</div>
                    </div>
                </section>
            </div>
        `;
    },

    renderNoteCard(id, title, topic, type, views, uploader, uploaderId, upvotedBy = [], downvotedBy = [], viewedBy = [], fileUrl) {
        const typeClass = type ? type.toLowerCase().replace(' ', '-') : 'notes';
        const upvotes = upvotedBy.length;
        const downvotes = downvotedBy.length;
        const totalViews = viewedBy.length > 0 ? viewedBy.length : (views || 0);
        const uid = AppState.user ? AppState.user.uid : null;
        const isUpvoted = uid && upvotedBy.includes(uid);
        const isDownvoted = uid && downvotedBy.includes(uid);
        
        return `
            <div class="note-card" style="cursor: pointer;" onclick="window.handleViewAndOpen('${id}', '${fileUrl}')">
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
                </div>
            </div>
        `;
    },

    async init() {
        const feedGrid = document.getElementById('home-feed-grid');
        if (!feedGrid) return;
        
        try {
            const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                feedGrid.innerHTML = '<div style="color: var(--text-muted);">No notes found. Be the first to upload!</div>';
                return;
            }
            
            let html = '';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                html += this.renderNoteCard(
                    doc.id,
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
        } catch (error) {
            console.error("Error fetching notes: ", error);
            feedGrid.innerHTML = '<div style="color: #ff4d4d;">Failed to load notes.</div>';
        }
    }
};
