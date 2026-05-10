# Coffee_Coders_project
## **StudyShare**
## Team Name: Coffee Coders

**Problem Statement**  
Students don't have ease of access to notes, PYQs, or proper guidance on the subjects, or even how to approach the exam.

**Solution**  
An online web platform for accessing and uploading notes, PYQs, references, etc. Easily search with keywords to access the files needed which are uploaded by other users. Also provides a feature to chat with the peers and users who uploaded the note to ask doubts. Upvotes and downvotes to grade the notes uploaded and can be used to recommend it to users based on the upvote count.

---

## 💻 Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 (Custom Pure Black Dark Mode)
- **Bundler/Build Tool**: Vite
- **Backend/BaaS**: Firebase
  - **Firebase Authentication**: For secure user login and registration
  - **Firestore (NoSQL)**: Real-time database for users, notes, votes, and E2E chat messages
  - **Firebase Storage**: Cloud storage for hosting uploaded PDFs and documents
- **Version Control**: Git & GitHub

---

## 🚀 Setup Procedure (Local Development)

Follow these steps to run the application locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AravindV456/Coffee_Coders_project.git
   cd Coffee_Coders_project
   ```

2. **Install Dependencies:**
   Ensure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

3. **Firebase Configuration:**
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password), Firestore, and Storage.
   - Update your Firebase config inside `js/firebase.js` with your project's credentials.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The app will typically be available at `http://localhost:5173`.

---

## 🌐 Deployment Procedure

This application is built with Vite, meaning it generates highly optimized static assets that can be effortlessly deployed to Vercel, Netlify, or Firebase Hosting.

**To deploy using Vercel (Recommended):**
1. Push your latest code to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository (`Coffee_Coders_project`).
4. Set the Framework Preset to **Vite** (Vercel usually detects this automatically).
5. Leave the build command as `npm run build` and output directory as `dist`.
6. Click **Deploy**. Vercel will build and host your website automatically!

---

## 🔗 Deployed Website
**Live Demo:** [Insert Deployed Website Link Here]
