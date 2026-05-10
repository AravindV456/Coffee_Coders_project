import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import { supabase } from "../supabase.js";

window.UploadPage = {
    render() {
        return `
            <div class="animate-fade-in" style="max-width: 800px;">
                <h1 style="margin-bottom: 2rem;">Upload Study Material</h1>
                
                <div class="auth-card">
                    <form id="upload-form">
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Select Category</label>
                            <select id="upload-category" class="input-field" required>
                                <option value="Notes">Notes</option>
                                <option value="Short Notes">Short Notes</option>
                                <option value="PYQs">PYQs</option>
                                <option value="Reference Book">Reference Book</option>
                            </select>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Subject</label>
                                <input type="text" id="upload-subject" class="input-field" placeholder="e.g. Thermodynamics" required>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Unit</label>
                                <input type="text" id="upload-unit" class="input-field" placeholder="e.g. Unit 3" required>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Topic</label>
                                <input type="text" id="upload-topic" class="input-field" placeholder="e.g. Entropy Laws" required>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Semester</label>
                                <input type="text" id="upload-semester" class="input-field" placeholder="e.g. 5th Sem" required>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Scheme</label>
                            <input type="text" id="upload-scheme" class="input-field" placeholder="e.g. 2018 Scheme" required>
                        </div>
                        
                        <input type="file" id="file-upload" style="display: none;" required>
                        <div id="upload-area" style="margin-bottom: 2rem; border: 2px dashed var(--border-color); border-radius: var(--radius-md); padding: 3rem; text-align: center; cursor: pointer; transition: border-color 0.3s;" onmouseover="this.style.borderColor='var(--accent-primary)'" onmouseout="this.style.borderColor='var(--border-color)'">
                            ${Icons.Upload(32)}
                            <p style="margin-top: 1rem; color: var(--text-secondary);" id="upload-text">Drag and drop your file here or <span style="color: var(--accent-primary);">Browse</span></p>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">PDF, DOCX, JPG (Max 50MB)</p>
                        </div>
                        
                        <button type="submit" id="submit-upload" class="btn btn-primary w-full">Upload Material</button>
                        <div id="upload-progress" style="margin-top: 1rem; text-align: center; color: var(--accent-primary); display: none;">Uploading...</div>
                    </form>
                </div>
            </div>
        `;
    },
    init() {
        const fileUpload = document.getElementById('file-upload');
        const uploadArea = document.getElementById('upload-area');
        const uploadText = document.getElementById('upload-text');
        
        if (uploadArea && fileUpload) {
            uploadArea.addEventListener('click', () => {
                fileUpload.click();
            });
            
            fileUpload.addEventListener('change', () => {
                if (fileUpload.files.length > 0) {
                    uploadText.innerHTML = `Selected file: <span style="color: var(--accent-primary);">${fileUpload.files[0].name}</span>`;
                }
            });
        }
        
        const form = document.getElementById('upload-form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!AppState.user) {
                alert('Please login to upload material.');
                return;
            }
            
            const file = fileUpload.files[0];
            if (!file) {
                alert('Please select a file.');
                return;
            }
            
            const submitBtn = document.getElementById('submit-upload');
            const progressText = document.getElementById('upload-progress');
            submitBtn.disabled = true;
            progressText.style.display = 'block';
            
            try {
                // Upload to Supabase Storage
                const fileName = `${Date.now()}_${file.name}`;
                const { data, error } = await supabase.storage
                    .from('materials')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });
                
                if (error) {
                    throw error;
                }
                
                progressText.innerText = 'Uploading... 100%';
                
                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from('materials')
                    .getPublicUrl(fileName);
                    
                const downloadURL = publicUrlData.publicUrl;
                
                // Save to Firestore
                await addDoc(collection(db, "notes"), {
                    category: document.getElementById('upload-category').value,
                    subject: document.getElementById('upload-subject').value,
                    unit: document.getElementById('upload-unit').value,
                    topic: document.getElementById('upload-topic').value,
                    semester: document.getElementById('upload-semester').value,
                    scheme: document.getElementById('upload-scheme').value,
                    fileUrl: downloadURL,
                    fileName: file.name,
                    uploaderId: AppState.user.uid,
                    uploaderName: AppState.user.name || 'Anonymous',
                    views: 0,
                    upvotes: 0,
                    downvotes: 0,
                    createdAt: serverTimestamp()
                });
                
                alert('File uploaded successfully! It is now live on the platform.');
                navigateTo('home');
            } catch (error) {
                console.error("Error uploading: ", error);
                alert("Error uploading file: " + error.message);
                submitBtn.disabled = false;
                progressText.style.display = 'none';
            }
        });
    }
};
