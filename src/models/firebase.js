// Firebase imports
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const provider = new firebase.auth.GoogleAuthProvider();
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBM1E-ugDaw3X1xTi_NBOCYkaG-ffpGRg",
  authDomain: "covid-facility.firebaseapp.com",
  projectId: "covid-facility",
  storageBucket: "covid-facility.appspot.com",
  messagingSenderId: "1019911003749",
  appId: "1:1019911003749:web:cda843bf4cd5cffcb4b08c",
  measurementId: "G-1205BK95B0",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};
