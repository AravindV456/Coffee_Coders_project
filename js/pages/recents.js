const RecentsPage = {
    render() {
        const history = [
            { title: 'Compiler Design', topic: 'Intermediate Code Generation', date: 'Oct 24, 2023', time: '14:30', uploader: 'Prof. Miller' },
            { title: 'Software Engineering', topic: 'Agile Methodologies', date: 'Oct 23, 2023', time: '09:15', uploader: 'Jane Smith' },
            { title: 'Machine Learning', topic: 'Neural Networks Basics', date: 'Oct 22, 2023', time: '18:45', uploader: 'Dr. Watson' }
        ];

        return `
            <div class="animate-fade-in">
                <h1 style="margin-bottom: 2rem;">Recently Viewed</h1>
                
                <div class="auth-card" style="padding: 0; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-color); text-align: left;">
                                <th style="padding: 1rem 1.5rem; color: var(--text-muted); font-size: 0.8rem;">NOTE TITLE</th>
                                <th style="padding: 1rem 1.5rem; color: var(--text-muted); font-size: 0.8rem;">UPLOADED BY</th>
                                <th style="padding: 1rem 1.5rem; color: var(--text-muted); font-size: 0.8rem;">DATE & TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${history.map(item => `
                                <tr style="border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(0,230,230,0.05)'" onmouseout="this.style.background='transparent'">
                                    <td style="padding: 1.25rem 1.5rem;">
                                        <div style="font-weight: 600;">${item.title}</div>
                                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${item.topic}</div>
                                    </td>
                                    <td style="padding: 1.25rem 1.5rem; color: var(--text-secondary);">${item.uploader}</td>
                                    <td style="padding: 1.25rem 1.5rem; color: var(--text-secondary);">
                                        <div>${item.date}</div>
                                        <div style="font-size: 0.8rem; opacity: 0.7;">${item.time}</div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },
    init() {}
};
