const ChatPage = {
    render() {
        return `
            <div class="animate-fade-in" style="height: calc(100vh - 150px); display: flex; flex-direction: column;">
                <div class="flex items-center gap-4" style="margin-bottom: 1.5rem;">
                    <h1 style="margin: 0;">Messages</h1>
                    <span style="font-size: 0.7rem; background: rgba(0,230,230,0.1); color: var(--accent-primary); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--accent-primary);">E2E ENCRYPTED</span>
                </div>
                
                <div class="flex gap-4" style="flex: 1; min-height: 0;">
                    <!-- Chat List -->
                    <div class="auth-card" style="width: 300px; padding: 0; display: flex; flex-direction: column;">
                        <div style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                            <input type="text" class="input-field" style="margin: 0; padding: 8px 12px; font-size: 0.9rem;" placeholder="Search chats...">
                        </div>
                        <div style="flex: 1; overflow-y: auto;">
                            ${this.renderChatItem('Admin: John Doe', 'How can I help you?', '2m ago', true)}
                            ${this.renderChatItem('Admin: Jane Smith', 'The file was approved.', '1h ago', false)}
                            ${this.renderChatItem('Support Bot', 'Welcome to GoHack!', 'Yesterday', false)}
                        </div>
                    </div>
                    
                    <!-- Chat Area -->
                    <div class="auth-card" style="flex: 1; padding: 0; display: flex; flex-direction: column;">
                        <div style="padding: 1rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                            <div class="flex items-center gap-3">
                                <div style="width: 36px; height: 36px; background: var(--accent-secondary); border-radius: 50%;"></div>
                                <div>
                                    <p style="font-weight: 600; font-size: 0.9rem;">Admin: John Doe</p>
                                    <p style="font-size: 0.7rem; color: var(--accent-primary);">Online</p>
                                </div>
                            </div>
                        </div>
                        
                        <div style="flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;">
                            <div style="align-self: flex-start; max-width: 70%; background: var(--bg-input); padding: 10px 14px; border-radius: 0 12px 12px 12px; font-size: 0.9rem;">
                                Hello! I saw your message about the Mathematics notes.
                            </div>
                            <div style="align-self: flex-end; max-width: 70%; background: var(--accent-primary); color: #000; padding: 10px 14px; border-radius: 12px 12px 0 12px; font-size: 0.9rem; font-weight: 500;">
                                Hi! Yes, I wanted to clarify a formula in Unit 2.
                            </div>
                            <div style="align-self: flex-start; max-width: 70%; background: var(--bg-input); padding: 10px 14px; border-radius: 0 12px 12px 12px; font-size: 0.9rem;">
                                Sure, go ahead. I'm here to help.
                            </div>
                        </div>
                        
                        <div style="padding: 1rem; border-top: 1px solid var(--border-color);">
                            <div class="flex gap-2">
                                <input type="text" class="input-field" style="margin: 0;" placeholder="Type your message...">
                                <button class="btn btn-primary">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderChatItem(name, lastMsg, time, active) {
        return `
            <div style="padding: 1rem; border-bottom: 1px solid var(--border-color); cursor: pointer; background: ${active ? 'rgba(0,230,230,0.05)' : 'transparent'}; transition: background 0.2s;">
                <div class="flex justify-between items-center" style="margin-bottom: 4px;">
                    <p style="font-weight: 600; font-size: 0.9rem;">${name}</p>
                    <p style="font-size: 0.7rem; color: var(--text-muted);">${time}</p>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lastMsg}</p>
            </div>
        `;
    },
    init() {}
};
