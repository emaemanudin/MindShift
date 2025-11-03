
// src/lib/firebase/config.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  // Check if all essential config values are present
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
  } else {
    console.error(
      "CRITICAL Firebase Config Error: Missing essential NEXT_PUBLIC_FIREBASE_ values. " +
      "The application will not be able to connect to Firebase. " +
      "Please ensure all required variables are set in src/.env"
    );
    // Create a dummy app to avoid crashing the server during build
    app = {} as FirebaseApp; 
  }
} else {
  app = getApp();
}

const auth: Auth = app.name ? getAuth(app) : {} as Auth;

export { app, auth };
