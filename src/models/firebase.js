// Firebase imports
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const provider = new firebase.auth.GoogleAuthProvider();
// Firebase configuration

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};
