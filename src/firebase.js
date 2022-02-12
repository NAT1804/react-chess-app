import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAdHdoAF2BzOpczRCHNk5nFxJZgtf7P3U8",
  authDomain: "react-chess-app-71c11.firebaseapp.com",
  projectId: "react-chess-app-71c11",
  storageBucket: "react-chess-app-71c11.appspot.com",
  messagingSenderId: "742632939883",
  appId: "1:742632939883:web:98c593610d95a7d6b36c2e",
  measurementId: "G-VR4F5936BC",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export default firebase;
