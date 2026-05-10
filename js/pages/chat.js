import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, getDocs, doc, updateDoc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase.js";

let currentChatUser = null;
let unsubscribeMessages = null;

window.ChatPage = {
    render() {
        return `
            <div class="animate-fade-in" style="height: calc(100vh - 150px); display: flex; flex-direction: column;">
                <div class="flex items-center gap-4" style="margin-bottom: 1.5rem;">
                    <h1 style="margin: 0;">Messages</h1>
                    <span style="font-size: 0.7rem; background: rgba(0,230,230,0.1); color: var(--accent-primary); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--accent-primary);">E2E ENCRYPTED</span>
                </div>
                
                <div class="flex gap-4" style="flex: 1; min-height: 0;">
                    <!-- Users List -->
                    <div class="auth-card" style="width: 300px; padding: 0; display: flex; flex-direction: column;">
                        <div style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                            <h3 style="margin: 0; font-size: 1rem;">Users</h3>
                            <input type="text" id="chat-user-search" class="input-field" style="margin-top: 0.5rem; margin-bottom: 0; padding: 0.5rem;" placeholder="Search users...">
                        </div>
                        <div id="chat-users-list" style="flex: 1; overflow-y: auto;">
                            <div style="padding: 1rem; color: var(--text-muted);">Loading users...</div>
                        </div>
                    </div>
                    
                    <!-- Chat Area -->
                    <div class="auth-card" style="flex: 1; padding: 0; display: flex; flex-direction: column;">
                        <div id="chat-header" style="padding: 1rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                            <div style="color: var(--text-muted);">Select a user to start chatting</div>
                        </div>
                        
                        <div id="chat-messages" style="flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;">
                            <!-- Messages will appear here -->
                        </div>
                        
                        <div style="padding: 1rem; border-top: 1px solid var(--border-color);">
                            <form id="chat-form" class="flex gap-2">
                                <input type="text" id="chat-input" class="input-field" style="margin: 0;" placeholder="Type your message..." disabled>
                                <button type="submit" id="chat-send-btn" class="btn btn-primary" disabled>Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        if (!AppState.user) {
            document.getElementById('chat-users-list').innerHTML = '<div style="padding: 1rem; color: #ff4d4d;">Please login to use chat.</div>';
            return;
        }

        // Fetch active chats from AppState
        try {
            let myChats = AppState.activeChats || [];
            
            // If target passed from profile, ensure they are in the list locally for UI until Firestore catches up
            if (AppState.pageData && AppState.pageData.targetUid) {
                if (!myChats.some(u => u.uid === AppState.pageData.targetUid)) {
                    myChats.unshift({ uid: AppState.pageData.targetUid, name: AppState.pageData.targetName, unreadCount: 0 });
                }
            }

            const usersList = document.getElementById('chat-users-list');

            const usersSnapshot = await getDocs(collection(db, "users"));
            let allUsers = [];
            usersSnapshot.forEach(doc => {
                if (doc.id !== AppState.user.uid) {
                    allUsers.push({ id: doc.id, ...doc.data() });
                }
            });

            this.renderUsers = (searchQuery = '') => {
                const listEl = document.getElementById('chat-users-list');
                if (!listEl) return;
                
                let myChats = AppState.activeChats || [];
                let html = '';
                
                // If not searching, just show active chats
                if (!searchQuery) {
                    myChats.forEach(chatData => {
                        html += `
                            <div class="chat-user-item" data-uid="${chatData.uid}" data-name="${chatData.name}" style="padding: 1rem; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.2s;">
                                <div class="flex justify-between items-center">
                                    <p style="font-weight: 600; font-size: 0.9rem; margin: 0;">${chatData.name}</p>
                                    ${chatData.unreadCount && chatData.unreadCount > 0 ? `<span style="background: #ff4d4d; color: white; border-radius: 50%; padding: 2px 6px; font-size: 0.7rem; font-weight: bold;">${chatData.unreadCount}</span>` : ''}
                                </div>
                                <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${chatData.lastMessage || 'No messages yet'}</p>
                            </div>
                        `;
                    });
                } else {
                    allUsers.forEach(userData => {
                        const isMatch = userData.name.toLowerCase().includes(searchQuery) ||
                            (userData.course && userData.course.toLowerCase().includes(searchQuery));
                        
                        if (isMatch) {
                            html += `
                                <div class="chat-user-item" data-uid="${userData.id}" data-name="${userData.name}" style="padding: 1rem; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.2s;">
                                    <p style="font-weight: 600; font-size: 0.9rem; margin: 0;">${userData.name}</p>
                                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">${userData.course || ''}</p>
                                </div>
                            `;
                        }
                    });
                }
                
                if (html === '') {
                    html = searchQuery ? '<div style="padding: 1rem; color: var(--text-muted);">No users found.</div>' : '<div style="padding: 1rem; color: var(--text-muted);">No active chats. Visit a user\'s profile to message them.</div>';
                }
                listEl.innerHTML = html;
                
                // Bind click listeners
                document.querySelectorAll('.chat-user-item').forEach(item => {
                    item.addEventListener('click', () => {
                        document.querySelectorAll('.chat-user-item').forEach(i => i.style.background = 'transparent');
                        item.style.background = 'rgba(0,230,230,0.05)';
                        
                        const uid = item.getAttribute('data-uid');
                        const name = item.getAttribute('data-name');
                        this.openChat(uid, name);
                    });
                });
            };

            // Initial render
            this.renderUsers();

            // Add search listener
            const searchInput = document.getElementById('chat-user-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.renderUsers(e.target.value.toLowerCase());
                });
            }
            // If opened with targetUid, open the chat automatically
            if (AppState.pageData && AppState.pageData.targetUid) {
                this.openChat(AppState.pageData.targetUid, AppState.pageData.targetName);
                // Highlight the user in list
                document.querySelectorAll('.chat-user-item').forEach(item => {
                    if (item.getAttribute('data-uid') === AppState.pageData.targetUid) {
                        item.style.background = 'rgba(0,230,230,0.05)';
                    }
                });
                AppState.pageData = null; // consume it
            }
        } catch (error) {
            console.error("Error loading users:", error);
            document.getElementById('chat-users-list').innerHTML = '<div style="padding: 1rem; color: #ff4d4d;">Failed to load users.</div>';
        }

        // Handle sending messages
        document.getElementById('chat-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const text = input.value.trim();
            if (!text || !currentChatUser) return;
            
            input.value = '';
            
            const chatId = this.getChatId(AppState.user.uid, currentChatUser.uid);
            
            try {
                await addDoc(collection(db, "chats", chatId, "messages"), {
                    text: text,
                    senderId: AppState.user.uid,
                    senderName: AppState.user.name,
                    createdAt: serverTimestamp(),
                    read: false
                });
                
                // Ensure user is in active chats in Firestore
                await setDoc(doc(db, "users", AppState.user.uid, "activeChats", currentChatUser.uid), {
                    uid: currentChatUser.uid,
                    name: currentChatUser.name,
                    lastMessage: text,
                    unreadCount: 0,
                    timestamp: serverTimestamp()
                }, { merge: true });
                
                await setDoc(doc(db, "users", currentChatUser.uid, "activeChats", AppState.user.uid), {
                    uid: AppState.user.uid,
                    name: AppState.user.name,
                    lastMessage: text,
                    unreadCount: increment(1),
                    timestamp: serverTimestamp()
                }, { merge: true });
                
            } catch (error) {
                console.error("Error sending message:", error);
                alert("Failed to send message.");
            }
        });
    },
    
    getChatId(uid1, uid2) {
        return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
    },
    
    openChat(targetUid, targetName) {
        currentChatUser = { uid: targetUid, name: targetName };
        
        // Mark as read in Firestore
        setDoc(doc(db, "users", AppState.user.uid, "activeChats", targetUid), {
            unreadCount: 0
        }, { merge: true }).catch(console.error);
        
        // Update header
        document.getElementById('chat-header').innerHTML = `
            <div class="flex items-center gap-3">
                <div style="width: 36px; height: 36px; background: var(--accent-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                    ${targetName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p style="font-weight: 600; font-size: 0.9rem;">${targetName}</p>
                </div>
            </div>
        `;
        
        // Enable input
        document.getElementById('chat-input').disabled = false;
        document.getElementById('chat-send-btn').disabled = false;
        
        // Subscribe to messages
        if (unsubscribeMessages) unsubscribeMessages();
        
        const chatId = this.getChatId(AppState.user.uid, targetUid);
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));
        
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted);">Loading messages...</div>';
        
        unsubscribeMessages = onSnapshot(q, (snapshot) => {
            let html = '';
            snapshot.forEach(msgDoc => {
                const data = msgDoc.data();
                const isMe = data.senderId === AppState.user.uid;
                
                if (!isMe && data.read === false) {
                    updateDoc(doc(db, "chats", chatId, "messages", msgDoc.id), { read: true }).catch(console.error);
                }
                
                if (isMe) {
                    const receiptIcon = data.read ? `<span style="color: #00e6e6; margin-left: 4px; vertical-align: middle;">${Icons.CheckDouble()}</span>` : `<span style="color: rgba(255,255,255,0.5); margin-left: 4px; vertical-align: middle;">${Icons.Check()}</span>`;
                    html += `
                        <div style="align-self: flex-end; max-width: 70%; background: var(--accent-primary); color: #000; padding: 10px 14px; border-radius: 12px 12px 0 12px; font-size: 0.9rem; font-weight: 500;">
                            ${data.text}
                            ${receiptIcon}
                        </div>
                    `;
                } else {
                    html += `
                        <div style="align-self: flex-start; max-width: 70%; background: var(--bg-input); padding: 10px 14px; border-radius: 0 12px 12px 12px; font-size: 0.9rem;">
                            ${data.text}
                        </div>
                    `;
                }
            });
            
            if (html === '') {
                html = '<div style="text-align: center; color: var(--text-muted); margin-top: auto; margin-bottom: auto;">No messages yet. Say hi!</div>';
            }
            
            messagesContainer.innerHTML = html;
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
    }
};
