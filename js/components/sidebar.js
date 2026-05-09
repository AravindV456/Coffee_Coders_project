const Sidebar = {
    render() {
        return `
            <aside class="sidebar ${AppState.sidebarOpen ? '' : 'sidebar-hidden'}" id="sidebar">
                <div style="margin-bottom: 2.5rem; display: flex; align-items: center; gap: 12px; padding: 0 10px;">
                    <div style="width: 32px; height: 32px; background: var(--accent-primary); border-radius: 8px; box-shadow: var(--neon-glow);"></div>
                    <span style="font-weight: 700; font-size: 1.25rem; letter-spacing: -0.5px;">StudySearch</span>
                </div>

                <nav style="flex: 1;">
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
