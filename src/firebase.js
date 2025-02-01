import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD34Fn6PjHNy7uQtbdlMKjxDQLCUenl5uM",
  authDomain: "quiz-62793.firebaseapp.com",
  projectId: "quiz-62793",
  storageBucket: "quiz-62793.firebasestorage.app",
  messagingSenderId: "974486425737",
  appId: "1:974486425737:web:e25c5cd907f6f7a12cb658",
  measurementId: "G-5HHZXQBMYD"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const provider = new GoogleAuthProvider();

// Export the required functions and objects
export { auth, provider, signInWithPopup, signOut, db, collection, addDoc, query, orderBy, limit, onSnapshot };
