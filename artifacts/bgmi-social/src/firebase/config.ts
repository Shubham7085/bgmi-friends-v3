import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-w2YPt3c8yIpGXgDOovi1qe3WSAvbV1A",
  authDomain: "bgmi-friends-vault-5703e.firebaseapp.com",
  projectId: "bgmi-friends-vault-5703e",
  storageBucket: "bgmi-friends-vault-5703e.firebasestorage.app",
  messagingSenderId: "480981069489",
  appId: "1:480981069489:web:938039124408551ec33c90",
  measurementId: "G-C4SL4KLRNW",
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { app, auth, db };

export function isFirebaseConfigured(): boolean { return true; }
