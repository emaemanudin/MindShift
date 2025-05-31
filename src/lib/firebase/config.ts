
// src/lib/firebase/config.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Log the API key to help with debugging
console.log("Firebase API Key from env (config.ts):", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log the entire config object to see if all values are being loaded
console.log("Full Firebase Config Object (config.ts):", firebaseConfig);

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  // Check if all essential config values are present
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error(
      "CRITICAL Firebase Config Error: Missing essential values (apiKey, authDomain, or projectId). " +
      "Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_ variables are set correctly " +
      "and that you have restarted your development server. " +
      "The application will attempt to initialize Firebase, but IT WILL LIKELY FAIL to connect or authenticate properly without these values."
    );
    // Depending on the app's needs, you might throw an error here
    // or prevent further execution that relies on Firebase.
    // For now, we'll log a critical error. The app will likely still try to initialize and fail.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
// const db: Firestore = getFirestore(app); // Optional: if you need Firestore

export { app, auth /*, db */ };

