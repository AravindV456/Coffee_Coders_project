window.RecentsPage = {
    render() {
        let history = [];
        try {
            history = JSON.parse(localStorage.getItem('recentNotes') || '[]');
        } catch(e) {
            console.error("Failed to parse recents", e);
        }

        const formatDate = (isoStr) => {
            const date = new Date(isoStr);
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
        };

        let rowsHtml = '';
        if (history.length === 0) {
            rowsHtml = `<tr><td colspan="3" style="padding: 2rem; text-align: center; color: var(--text-muted);">No recent notes viewed yet. Start exploring the Home page!</td></tr>`;
        } else {
            rowsHtml = history.map(item => {
                const { date, time } = formatDate(item.timestamp);
                return `
                <tr style="border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(0,230,230,0.05)'" onmouseout="this.style.background='transparent'" onclick="window.open('${item.fileUrl}', '_blank')">
                    <td style="padding: 1.25rem 1.5rem;">
                        <div style="font-weight: 600;">${item.title}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${item.topic}</div>
                    </td>
                    <td style="padding: 1.25rem 1.5rem; color: var(--text-secondary); cursor: pointer;" onclick="event.stopPropagation(); navigateTo('publicProfile', {targetUid: '${item.uploaderId}', uploaderName: '${item.uploader}'})">
                        ${item.uploader}
                    </td>
                    <td style="padding: 1.25rem 1.5rem; color: var(--text-secondary);">
                        <div>${date}</div>
                        <div style="font-size: 0.8rem; opacity: 0.7;">${time}</div>
                    </td>
                </tr>
                `;
            }).join('');
        }

        return `
            <div class="animate-fade-in">
                <h1 style="margin-bottom: 2rem;">Recently Viewed</h1>
                
                <div class="auth-card" style="padding: 0; overflow: hidden; overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-color); text-align: left;">
                                <th style="padding: 1rem 1.5rem; color: var(--text-muted); font-size: 0.8rem;">NOTE TITLE</th>
                                <th style="padding: 1rem 1.5rem; color: var(--text-muted); font-size: 0.8rem;">UPLOADED BY</th>
                                <th style="padding: 1rem 1.5rem; color: var(--text-muted); font-size: 0.8rem;">DATE & TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },
    init() {}
};
