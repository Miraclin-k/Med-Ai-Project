import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// =================================================================
// IMPORTANT: REPLACE WITH YOUR FIREBASE PROJECT CONFIGURATION
// =================================================================
// You can get this configuration object from the Firebase Console:
// Project Settings > General > Your apps > Web app > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqCamOBUYBbQK8iDy4qvE6WyZERfUUDgI",
  authDomain: "med-ai-f0219.firebaseapp.com",
  projectId: "med-ai-f0219",
  storageBucket: "med-ai-f0219.firebasestorage.app",
  messagingSenderId: "278237263019",
  appId: "1:278237263019:web:c470ac81a20d14aa3ef3ee",
  measurementId: "G-7Q649J6V3R"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the initialized services
export { auth, db };
