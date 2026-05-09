const UploadPage = {
    render() {
        return `
            <div class="animate-fade-in" style="max-width: 800px;">
                <h1 style="margin-bottom: 2rem;">Upload Study Material</h1>
                
                <div class="auth-card">
                    <form id="upload-form">
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Select Category</label>
                            <select class="input-field" required>
                                <option value="notes">Notes</option>
                                <option value="short notes">Short Notes</option>
                                <option value="pyqs">PYQs</option>
                                <option value="reference book">Reference Book</option>
                            </select>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Subject</label>
                                <input type="text" class="input-field" placeholder="e.g. Thermodynamics" required>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Unit</label>
                                <input type="text" class="input-field" placeholder="e.g. Unit 3" required>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Topic</label>
                                <input type="text" class="input-field" placeholder="e.g. Entropy Laws" required>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Semester</label>
                                <input type="text" class="input-field" placeholder="e.g. 5th Sem" required>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Scheme</label>
                            <input type="text" class="input-field" placeholder="e.g. 2018 Scheme" required>
                        </div>
                        
                        <div style="margin-bottom: 2rem; border: 2px dashed var(--border-color); border-radius: var(--radius-md); padding: 3rem; text-align: center; cursor: pointer; transition: border-color 0.3s;" onmouseover="this.style.borderColor='var(--accent-primary)'" onmouseout="this.style.borderColor='var(--border-color)'">
                            ${Icons.Upload(32)}
                            <p style="margin-top: 1rem; color: var(--text-secondary);">Drag and drop your file here or <span style="color: var(--accent-primary);">Browse</span></p>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">PDF, DOCX, JPG (Max 50MB)</p>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-full">Upload Material</button>
                    </form>
                </div>
            </div>
        `;
    },
    init() {
        const form = document.getElementById('upload-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('File uploaded successfully! It is now live on the platform.');
            navigateTo('home');
        });
    }
};
