// Import the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics"; // Import analytics
import { getStorage } from "firebase/storage"; // Import storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOdt1j8ByGUx5OyLCXoHd3UCUdSmpr2jE",
  authDomain: "beeapp-5c98b.firebaseapp.com",
  projectId: "beeapp-5c98b",
  storageBucket: "beeapp-5c98b.appspot.com",
  messagingSenderId: "835743244667",
  appId: "1:835743244667:web:b91ce308c109cc48c55dde",
  measurementId: "G-R7B107LC45",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app); // Initialize analytics (optional)
const storage = getStorage(app); // Initialize storage

// Export Firebase services to be used in other components
export { auth, db, analytics, storage };
