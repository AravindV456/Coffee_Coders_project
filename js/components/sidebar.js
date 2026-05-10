window.Sidebar = {
    render() {
        return `
            <aside class="sidebar ${AppState.sidebarOpen ? '' : 'sidebar-hidden'}" id="sidebar">
                <nav style="flex: 1; margin-top: 1rem;">
                    <div class="nav-link ${AppState.currentPage === 'home' ? 'active' : ''}" data-page="home">
                        ${Icons.Home()} <span>Home</span>
                    </div>
                    <div class="nav-link ${AppState.currentPage === 'profile' ? 'active' : ''}" data-page="profile">
                        ${Icons.User()} <span>Profile</span>
                    </div>
                    <div class="nav-link ${AppState.currentPage === 'recents' ? 'active' : ''}" data-page="recents">
                        ${Icons.Clock()} <span>Recents</span>
                    </div>
                    <div class="nav-link ${AppState.currentPage === 'upload' ? 'active' : ''}" data-page="upload">
                        ${Icons.Upload()} <span>Uploads</span>
                    </div>
                    <div class="nav-link ${AppState.currentPage === 'chat' ? 'active' : ''}" data-page="chat">
                        ${Icons.MessageCircle()} <span>Chat</span>
                        ${AppState.totalUnread > 0 ? `<span class="notification-badge" style="background: #ff4d4d; color: white; border-radius: 50%; padding: 2px 6px; font-size: 0.7rem; font-weight: bold; margin-left: auto;">${AppState.totalUnread}</span>` : ''}
                    </div>
                </nav>

                <div style="margin-top: auto;">
                    <div class="nav-link ${AppState.currentPage === 'settings' ? 'active' : ''}" data-page="settings">
                        ${Icons.Settings()} <span>Settings</span>
                    </div>
                    <div class="nav-link" id="logout-btn" style="color: #ff4d4d;">
                        ${Icons.LogOut()} <span>Logout</span>
                    </div>
                </div>
            </aside>
        `;
    },

    init() {
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const page = link.getAttribute('data-page');
                navigateTo(page);
            });
        });

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                AppState.user = null;
                navigateTo('login');
            });
        }
    }
};
