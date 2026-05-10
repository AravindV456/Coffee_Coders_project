import './components/icons.js';
import './pages/auth.js';
import './components/sidebar.js';
import './pages/home.js';
import './pages/profile.js';
import './pages/recents.js';
import './pages/upload.js';
import './pages/settings.js';
import './pages/chat.js';

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
            default: contentHtml = HomePage.render();
        }
        
        mainContent.innerHTML = topbarHtml + contentHtml;
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
    }
}

window.navigateTo = function(page) {
    AppState.currentPage = page;
    renderApp();
    window.scrollTo(0, 0);
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
});
