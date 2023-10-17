// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2wwf7Z_BnS27ANKTuqEjZQy0wfj_IrP8",
  authDomain: "cooplearn-auth.firebaseapp.com",
  projectId: "cooplearn-auth",
  storageBucket: "cooplearn-auth.appspot.com",
  messagingSenderId: "600994871670",
  appId: "1:600994871670:web:e50c58e89d94dc4e18a257",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
