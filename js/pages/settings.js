const SettingsPage = {
    render() {
        return `
            <div class="animate-fade-in" style="max-width: 600px;">
                <h1 style="margin-bottom: 2rem;">Settings</h1>
                
                <div class="auth-card">
                    <h3 style="margin-bottom: 1.5rem;">Appearance</h3>
                    <div class="flex justify-between items-center" style="padding: 1rem; background: var(--bg-input); border-radius: var(--radius-md);">
                        <div>
                            <p style="font-weight: 600;">Dark Mode</p>
                            <p style="font-size: 0.8rem; color: var(--text-secondary);">Subtle neon aesthetic</p>
                        </div>
                        <div style="width: 50px; height: 26px; background: var(--accent-primary); border-radius: 20px; position: relative; cursor: pointer;">
                            <div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 3px; right: 3px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center" style="padding: 1rem; background: var(--bg-input); border-radius: var(--radius-md); margin-top: 1rem; opacity: 0.5; cursor: not-allowed;">
                        <div>
                            <p style="font-weight: 600;">Light Mode</p>
                            <p style="font-size: 0.8rem; color: var(--text-secondary);">Classic bright interface</p>
                        </div>
                        <div style="width: 50px; height: 26px; background: var(--text-muted); border-radius: 20px; position: relative;">
                            <div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 3px; left: 3px;"></div>
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
    init() {}
};
