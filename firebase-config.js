/**
 * ═══════════════════════════════════════════════════════════════
 *  FIREBASE CONFIGURATION — Ashish Portfolio CMS
 * ═══════════════════════════════════════════════════════════════
 *
 *  HOW TO SET UP (one-time):
 *
 *  1. Go to https://console.firebase.google.com
 *  2. Click "Create a project" → name it "ashish-portfolio"
 *  3. Disable Google Analytics (not needed) → Create
 *  4. In the left sidebar click "Build" → "Firestore Database"
 *     → Click "Create database" → Start in PRODUCTION mode
 *     → Pick location closest to you (asia-south1 for India)
 *  5. In sidebar click "Build" → "Authentication"
 *     → Click "Get started" → Enable "Email/Password"
 *     → Go to "Users" tab → Click "Add user"
 *     → Enter YOUR email + a strong password (this is your admin login)
 *  6. In sidebar click "Build" → "Storage"
 *     → Click "Get started" → Start in PRODUCTION mode
 *  7. Click the gear icon (Project Settings) at top-left
 *     → Scroll down to "Your apps" → Click the </> (Web) icon
 *     → Register app name: "portfolio" (no hosting needed)
 *     → Copy the firebaseConfig object below
 *  8. PASTE your config values into the object below
 *  9. SET FIRESTORE RULES (sidebar → Firestore → Rules tab):
 *     Paste this:
 *
 *     rules_version = '2';
 *     service cloud.firestore {
 *       match /databases/{database}/documents {
 *         // Anyone can READ projects and categories
 *         match /portfolioProjects/{doc} {
 *           allow read: if true;
 *           allow write: if request.auth != null;
 *         }
 *         match /categories/{doc} {
 *           allow read: if true;
 *           allow write: if request.auth != null;
 *         }
 *       }
 *     }
 *
 *  10. SET STORAGE RULES (sidebar → Storage → Rules tab):
 *      Paste this:
 *
 *      rules_version = '2';
 *      service firebase.storage {
 *        match /b/{bucket}/o {
 *          match /project-images/{allPaths=**} {
 *            allow read: if true;
 *            allow write: if request.auth != null;
 *          }
 *        }
 *      }
 *
 *  DONE! Your Firebase is ready.
 * ═══════════════════════════════════════════════════════════════
 */

// ─── REPLACE THESE VALUES WITH YOUR FIREBASE CONFIG ─────────
const firebaseConfig = {
  apiKey: "AIzaSyDtSCchu6kX5rmLiDuBAzzyQqnrVv6Hyow",
  authDomain: "ashish-portfolio-52355.firebaseapp.com",
  projectId: "ashish-portfolio-52355",
  storageBucket: "ashish-portfolio-52355.firebasestorage.app",
  messagingSenderId: "876608921720",
  appId: "1:876608921720:web:af4185f0abea3568f48d8d"
}

// ─── INITIALIZE FIREBASE ────────────────────────────────────
firebase.initializeApp(firebaseConfig);

// ─── EXPORT SERVICES ────────────────────────────────────────
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Keep auth session persistent (stay logged in)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

console.log('✓ Firebase initialized');
