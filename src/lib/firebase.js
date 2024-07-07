// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBLqVRigyEe8EBQUAXJFajVa5Ph0dhQDJA",
  authDomain: "chat-4f995.firebaseapp.com",
  projectId: "chat-4f995",
  storageBucket: "chat-4f995.appspot.com",
  messagingSenderId: "825020704040",
  appId: "1:825020704040:web:a8f3f0bf4d63aa37489c1d",
  measurementId: "G-B6E9N9BW3W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
