// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "webdev-d00f8.firebaseapp.com",
  databaseURL: "https://webdev-d00f8-default-rtdb.firebaseio.com",
  projectId: "webdev-d00f8",
  storageBucket: "webdev-d00f8.appspot.com",
  messagingSenderId: "666391682027",
  appId: "1:666391682027:web:e02c136ac3f10b405e97ae",
  measurementId: "G-2WQ2Q1MPXP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
