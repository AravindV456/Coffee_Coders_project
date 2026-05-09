const HomePage = {
    render() {
        return `
            <div class="animate-fade-in">
                <header class="topbar">
                    <button class="menu-toggle" id="menu-toggle">
                        ${Icons.Menu()}
                    </button>
                    
                    <div class="search-container">
                        <span class="search-icon">${Icons.Search()}</span>
                        <input type="text" class="search-input" placeholder="Search notes, PYQs, subjects...">
                    </div>
                    
                    <div style="width: 40px;"></div> <!-- Spacer -->
                </header>

                <section style="margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Recommended for you</h2>
                    <div class="feed-grid">
                        ${this.renderNoteCard('Engineering Mathematics', 'Unit 2: Calculus', 'Notes', '3.2k', 'John Doe')}
                        ${this.renderNoteCard('Data Structures', 'PYQ 2023 - Semester 4', 'PYQs', '1.5k', 'Jane Smith')}
                        ${this.renderNoteCard('Database Systems', 'Short Notes: SQL Queries', 'Short Notes', '850', 'Alex Chen')}
                        ${this.renderNoteCard('Operating Systems', 'Reference Book: Silberschatz', 'Reference Book', '2.1k', 'Admin')}
                        ${this.renderNoteCard('Digital Electronics', 'Unit 1: Logic Gates', 'Notes', '1.1k', 'Sarah Lee')}
                        ${this.renderNoteCard('Computer Networks', 'OSI Model Detailed', 'Notes', '4.3k', 'Mike Ross')}
                    </div>
                </section>
            </div>
        `;
    },

    renderNoteCard(title, topic, type, views, uploader) {
        const typeClass = type.toLowerCase().replace(' ', '-');
        return `
            <div class="note-card">
                <div class="flex justify-between items-start" style="margin-bottom: 1rem;">
                    <span class="tag tag-${typeClass}">${type}</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${views} views</span>
                </div>
                <h3 style="margin-bottom: 0.5rem; font-size: 1.1rem;">${title}</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${topic}</p>
                <p style="color: var(--text-muted); font-size: 0.8rem;">Uploaded by <b>${uploader}</b></p>
                
                <div class="card-actions">
                    <button class="action-btn">${Icons.ArrowUp()} <span>124</span></button>
                    <button class="action-btn">${Icons.ArrowDown()} <span>12</span></button>
                    <button class="action-btn">${Icons.MessageCircle(18)} <span>18</span></button>
                    <button class="action-btn" style="margin-left: auto;" onclick="navigateTo('chat')">Chat</button>
                </div>
            </div>
        `;
    },

    init() {
        const menuToggle = document.getElementById('menu-toggle');
        menuToggle.addEventListener('click', () => {
            AppState.sidebarOpen = !AppState.sidebarOpen;
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.querySelector('.main-content');
            
            if (AppState.sidebarOpen) {
                sidebar.classList.remove('sidebar-hidden');
                mainContent.classList.add('sidebar-open');
            } else {
                sidebar.classList.add('sidebar-hidden');
                mainContent.classList.remove('sidebar-open');
            }
        });
    }
};
