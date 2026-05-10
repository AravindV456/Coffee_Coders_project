import './components/icons.js';
import { initParticles } from './components/particles.js';
import './pages/auth.js';
import './components/sidebar.js';
import './pages/home.js';
import './pages/profile.js';
import './pages/recents.js';
import './pages/upload.js';
import './pages/settings.js';
import './pages/chat.js';
import './pages/publicProfile.js';
import { db } from './firebase.js';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

window.AppState = {
    user: null,
    currentPage: 'login', // login, signup, home, profile, recents, upload, settings, chat
    theme: 'dark',
    sidebarOpen: true
};

window.renderApp = function() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';

    // Apply theme to body
    if (AppState.theme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }

    if (AppState.currentPage === 'login' || AppState.currentPage === 'signup') {
        appContainer.innerHTML = AuthPage.render();
        AuthPage.init();
    } else {
        // Dashboard layout
        const layout = document.createElement('div');
        layout.className = 'dashboard-layout';
        
        const sidebarHtml = Sidebar.render();
        layout.innerHTML = sidebarHtml;
        
        const mainContent = document.createElement('main');
        mainContent.className = `main-content ${AppState.sidebarOpen ? 'sidebar-open' : ''}`;
        
        const topbarHtml = `
            <header class="topbar">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button class="menu-toggle" id="global-menu-toggle" style="margin-right: 10px;">
                        ${Icons.Menu()}
                    </button>
                    <img src="assets/logo.jpg" alt="StudySearch Logo" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;">
                    <span style="font-weight: 700; font-size: 1.25rem; letter-spacing: -0.5px;">StudySearch</span>
                </div>
                ${AppState.currentPage === 'home' ? `
                <div class="search-container">
                    <span class="search-icon">${Icons.Search()}</span>
                    <input type="text" class="search-input" placeholder="Search notes, PYQs, subjects...">
                </div>
                ` : '<div style="flex: 1;"></div>'}
                <div style="width: 40px;"></div>
            </header>
        `;
        
        // Render current sub-page
        let contentHtml = '';
        switch(AppState.currentPage) {
            case 'home': contentHtml = HomePage.render(); break;
            case 'profile': contentHtml = ProfilePage.render(); break;
            case 'recents': contentHtml = RecentsPage.render(); break;
            case 'upload': contentHtml = UploadPage.render(); break;
            case 'settings': contentHtml = SettingsPage.render(); break;
            case 'chat': contentHtml = ChatPage.render(); break;
            case 'publicProfile': contentHtml = window.PublicProfilePage.render(); break;
            default: contentHtml = HomePage.render();
        }
        
        const footerHtml = `
            <footer style="margin-top: 4rem; padding-top: 2rem; padding-bottom: 2rem; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                <p style="margin-bottom: 0.5rem;">Designed By Aravind V Kumar and Devapriya R</p>
                <div style="display: flex; justify-content: center; gap: 1rem;">
                    <a href="https://www.linkedin.com/in/aravind-v-kumar-6818b0257/" target="_blank" style="color: var(--accent-primary);">Aravind's LinkedIn</a>
                    <a href="https://www.linkedin.com/in/devapriya-r-099433337?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" style="color: var(--accent-primary);">Devapriya's LinkedIn</a>
                </div>
            </footer>
        `;
        
        mainContent.innerHTML = topbarHtml + contentHtml + footerHtml;
        layout.appendChild(mainContent);
        appContainer.appendChild(layout);
        
        // Initialize components
        Sidebar.init();
        
        const globalMenuToggle = document.getElementById('global-menu-toggle');
        if (globalMenuToggle) {
            globalMenuToggle.addEventListener('click', () => {
                AppState.sidebarOpen = !AppState.sidebarOpen;
                const sidebar = document.getElementById('sidebar');
                if (AppState.sidebarOpen) {
                    sidebar.classList.remove('sidebar-hidden');
                    mainContent.classList.add('sidebar-open');
                } else {
                    sidebar.classList.add('sidebar-hidden');
                    mainContent.classList.remove('sidebar-open');
                }
            });
        }
        
        initCurrentPage();
    }
}

window.initCurrentPage = function() {
    switch(AppState.currentPage) {
        case 'home': HomePage.init(); break;
        case 'profile': ProfilePage.init(); break;
        case 'recents': RecentsPage.init(); break;
        case 'upload': UploadPage.init(); break;
        case 'settings': SettingsPage.init(); break;
        case 'chat': ChatPage.init(); break;
        case 'publicProfile': window.PublicProfilePage.init(); break;
    }
}

window.navigateTo = function(page, data = null) {
    AppState.currentPage = page;
    if (data) AppState.pageData = data;
    renderApp();
    window.scrollTo(0, 0);
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    renderApp();
});

window.handleVote = async function(noteId, voteType, event) {
    event.stopPropagation();
    if (!AppState.user) {
        alert("Please login to vote.");
        return;
    }
    const noteRef = doc(db, 'notes', noteId);
    try {
        const noteSnap = await getDoc(noteRef);
        if (noteSnap.exists()) {
            const data = noteSnap.data();
            let upvotedBy = data.upvotedBy || [];
            let downvotedBy = data.downvotedBy || [];
            const uid = AppState.user.uid;

            if (voteType === 'up') {
                if (upvotedBy.includes(uid)) {
                    upvotedBy = upvotedBy.filter(id => id !== uid);
                } else {
                    upvotedBy.push(uid);
                    downvotedBy = downvotedBy.filter(id => id !== uid);
                }
            } else if (voteType === 'down') {
                if (downvotedBy.includes(uid)) {
                    downvotedBy = downvotedBy.filter(id => id !== uid);
                } else {
                    downvotedBy.push(uid);
                    upvotedBy = upvotedBy.filter(id => id !== uid);
                }
            }

            await updateDoc(noteRef, { upvotedBy, downvotedBy });
            renderApp(); // Refresh UI to show new counts
        }
    } catch (e) {
        console.error("Error voting:", e);
    }
};

window.handleViewAndOpen = async function(noteId, fileUrl, title, topic, uploader) {
    // Open the file immediately in a new tab for good UX
    window.open(fileUrl, '_blank');
    
    // Save to local storage for Recents tab
    try {
        let recents = JSON.parse(localStorage.getItem('recentNotes') || '[]');
        // Remove if exists to push to top
        recents = recents.filter(n => n.noteId !== noteId);
        recents.unshift({
            noteId, title, topic, uploader, fileUrl, timestamp: new Date().toISOString()
        });
        // Keep only top 20
        if (recents.length > 20) recents = recents.slice(0, 20);
        localStorage.setItem('recentNotes', JSON.stringify(recents));
    } catch (e) {
        console.error("Error saving recents:", e);
    }

    // Track unique views for logged-in users
    if (!AppState.user) return;
    
    try {
        const noteRef = doc(db, 'notes', noteId);
        await updateDoc(noteRef, {
            viewedBy: arrayUnion(AppState.user.uid)
        });
        // Render app to update the view counter visually if the user returns to this tab
        renderApp();
    } catch (e) {
        console.error("Error updating views:", e);
    }
};
