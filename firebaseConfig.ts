// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOeo1WoPi1WWtlwZAZtfgaH_wtNQr0xrY",
  authDomain: "atlas-lumigram-4c9c8.firebaseapp.com",
  projectId: "atlas-lumigram-4c9c8",
  storageBucket: "atlas-lumigram-4c9c8.firebasestorage.app",
  messagingSenderId: "775729698329",
  appId: "1:775729698329:web:0f9124827a76722ecd3c88",
  measurementId: "G-LP7TQGLPS3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
