import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  const missingFields = requiredFields.filter(
    (field) => !firebaseConfig[field as keyof typeof firebaseConfig],
  );

  if (missingFields.length > 0) {
    console.error(
      "Firebase Configuration Error: Missing required environment variables:",
      missingFields,
    );
    console.log(
      "Please ensure .env.local file contains all Firebase credentials",
    );
    throw new Error(
      `Firebase config incomplete. Missing: ${missingFields.join(", ")}`,
    );
  }

  return true;
};

// Validate config before initialization
try {
  validateFirebaseConfig();
} catch (error) {
  console.error("Firebase initialization failed:", error);
  throw error;
}

// Initialize Firebase
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, {
    // More resilient transport for networks/browsers that fail on HTTP/3 QUIC.
    experimentalAutoDetectLongPolling: true,
    useFetchStreams: false,
  });
  auth = getAuth(app);

  // Initialize analytics only in production
  if (import.meta.env.PROD) {
    getAnalytics(app);
  }

  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export { db, auth };
export default app;
