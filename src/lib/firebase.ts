// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "pothole-tracker-2mx78",
  "appId": "1:1095979557118:web:01bbd4a386a1baa070c5af",
  "storageBucket": "pothole-tracker-2mx78.firebasestorage.app",
  "apiKey": "AIzaSyCPj-0sZwVXDowliBa8Jk7BEUv71nVr06U",
  "authDomain": "pothole-tracker-2mx78.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1095979557118"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
