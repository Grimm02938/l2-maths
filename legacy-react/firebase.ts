import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

// Fallback config prevents hard crashes in preview/dev when .env is missing.
const app = initializeApp(
  hasFirebaseConfig
    ? firebaseConfig
    : {
        apiKey: 'demo-api-key',
        projectId: 'demo-project-id',
        appId: 'demo-app-id',
      },
);

if (!hasFirebaseConfig) {
  console.warn(
    'Firebase env vars are missing. Running in demo mode; auth/storage/database actions may fail until .env is configured.',
  );
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

let analytics = null;
if (typeof window !== 'undefined' && hasFirebaseConfig) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Firebase analytics disabled in this environment.', error);
  }
}

export { analytics };

export default app;