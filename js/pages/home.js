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

    renderNoteCard(title, topic, type, views, uploader, fileUrl) {
        const typeClass = type ? type.toLowerCase().replace(' ', '-') : 'notes';
        return `
            <div class="note-card">
                <div class="flex justify-between items-start" style="margin-bottom: 1rem;">
                    <span class="tag tag-${typeClass}">${type || 'Notes'}</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${views || 0} views</span>
                </div>
                <h3 style="margin-bottom: 0.5rem; font-size: 1.1rem;">${title}</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${topic}</p>
                <p style="color: var(--text-muted); font-size: 0.8rem;"><b>${uploader}</b></p>
                
                <div class="card-actions">
                    <button class="action-btn">${Icons.ArrowUp()} <span>0</span></button>
                    <button class="action-btn">${Icons.ArrowDown()} <span>0</span></button>
                    <button class="action-btn" style="margin-left: auto;" onclick="window.open('${fileUrl}', '_blank')">View</button>
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
                    data.subject,
                    data.topic,
                    data.category,
                    data.views,
                    data.uploaderName,
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
