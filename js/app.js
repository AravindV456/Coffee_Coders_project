const AppState = {
    user: null,
    currentPage: 'login', // login, signup, home, profile, recents, upload, settings, chat
    theme: 'dark',
    sidebarOpen: true
};

function renderApp() {
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
        
        mainContent.innerHTML = contentHtml;
        layout.appendChild(mainContent);
        appContainer.appendChild(layout);
        
        // Initialize components
        Sidebar.init();
        initCurrentPage();
    }
}

function initCurrentPage() {
    switch(AppState.currentPage) {
        case 'home': HomePage.init(); break;
        case 'profile': ProfilePage.init(); break;
        case 'recents': RecentsPage.init(); break;
        case 'upload': UploadPage.init(); break;
        case 'settings': SettingsPage.init(); break;
        case 'chat': ChatPage.init(); break;
    }
}

function navigateTo(page) {
    AppState.currentPage = page;
    renderApp();
    window.scrollTo(0, 0);
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
});
