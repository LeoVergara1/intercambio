// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCa0UdTm0GA9mnntabujlWG_XGqQEcYt4",
  authDomain: "intercambio-b7572.firebaseapp.com",
  databaseURL: "https://intercambio-b7572-default-rtdb.firebaseio.com",
  projectId: "intercambio-b7572",
  storageBucket: "intercambio-b7572.firebasestorage.app",
  messagingSenderId: "851053148034",
  appId: "1:851053148034:web:e9439f36256b3bc645c19b",
  measurementId: "G-TZ10FER8MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
