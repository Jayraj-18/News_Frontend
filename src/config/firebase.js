/**
 * Firebase Client SDK Configuration
 *
 * Used for client-side Firebase features (e.g., Firebase Auth in the future).
 *
 * HOW TO SET UP:
 * 1. Go to https://console.firebase.google.com
 * 2. Select your project → Project Settings → General → Your apps
 * 3. Click "Add app" → Web (</>)
 * 4. Copy the firebaseConfig object values below
 * 5. Create a `.env` file in the root of the News/ project (next to package.json)
 *    and add all the VITE_ variables shown in .env.example
 *
 * NOTE: All VITE_ prefixed variables are automatically exposed to the browser by Vite.
 * Never put secret server keys here — use the Backend/serviceAccountKey.json for that.
 */

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let firebaseApp = null;

// Only initialize if config values are present (avoids errors before .env is set up)
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebaseApp = initializeApp(firebaseConfig);
}

export { firebaseApp };
