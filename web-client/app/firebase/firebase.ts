// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged,
    User
} from "firebase/auth"

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxYPaJm2b8fGypFlWxygqsOdF2_pY3Cqo",
  authDomain: "mywatchlist-97eb8.firebaseapp.com",
  projectId: "mywatchlist-97eb8",
  appId: "1:512930577034:web:9665ac8233c3a0e9614b73",
  measurementId: "G-26VVX5TXYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);

/**
 * Sign the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider()); // could use different providers (github, facebook)
}

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */

export function signOut() {
    return auth.signOut();
}

/**
 * Trigger a callback when the user auth state changes.
 * @returns A function to unsubscribe callback
 */

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}