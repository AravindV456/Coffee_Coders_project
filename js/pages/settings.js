window.SettingsPage = {
    render() {
        const isDark = AppState.theme === 'dark';
        return `
            <div class="animate-fade-in" style="max-width: 600px;">
                <h1 style="margin-bottom: 2rem;">Settings</h1>
                
                <div class="auth-card">
                    <h3 style="margin-bottom: 1.5rem;">Appearance</h3>
                    <div class="flex justify-between items-center" style="padding: 1rem; background: var(--bg-input); border-radius: var(--radius-md);">
                        <div>
                            <p style="font-weight: 600;">${isDark ? 'Dark Mode' : 'Light Mode'}</p>
                            <p style="font-size: 0.8rem; color: var(--text-secondary);">
                                ${isDark ? 'Subtle neon aesthetic' : 'Classic bright interface'}
                            </p>
                        </div>
                        <div id="theme-toggle" style="width: 50px; height: 26px; background: ${isDark ? 'var(--accent-primary)' : '#cbd5e0'}; border-radius: 20px; position: relative; cursor: pointer; transition: background 0.3s;">
                            <div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 3px; ${isDark ? 'right: 3px;' : 'left: 3px;'} box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: all 0.3s;"></div>
                        </div>
                    </div>
                    
                    <h3 style="margin-top: 2rem; margin-bottom: 1.5rem;">Account Notifications</h3>
                    <div class="flex items-center gap-3" style="margin-bottom: 1rem;">
                        <input type="checkbox" checked style="accent-color: var(--accent-primary); width: 18px; height: 18px;">
                        <span>Notify me when someone comments on my notes</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <input type="checkbox" checked style="accent-color: var(--accent-primary); width: 18px; height: 18px;">
                        <span>Notify me about new PYQs in my course</span>
                    </div>
                </div>
            </div>
        `;
    },
    init() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
                
                // Apply theme to body
                if (AppState.theme === 'light') {
                    document.body.classList.add('light-mode');
                } else {
                    document.body.classList.remove('light-mode');
                }
                
                // Re-render the page to update the toggle UI
                renderApp();
            });
        }
    }
};
