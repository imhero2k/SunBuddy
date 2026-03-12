import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase config for SunBuddy web app
const firebaseConfig = {
  apiKey: "AIzaSyBvTr7uaiG6ahNqSUGOCIXKuU-Z-oCVmQQ",
  authDomain: "sunbuddy-4bda7.firebaseapp.com",
  projectId: "sunbuddy-4bda7",
  storageBucket: "sunbuddy-4bda7.firebasestorage.app",
  messagingSenderId: "1028963956379",
  appId: "1:1028963956379:web:d00fed487d5ca18f0d783e",
  measurementId: "G-HTM4GT5T6L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

