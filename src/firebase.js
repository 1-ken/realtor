// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3BEqWZAcHZQoydqt09NTnAVzThifs05E",
  authDomain: "realtor-68387.firebaseapp.com",
  projectId: "realtor-68387",
  storageBucket: "realtor-68387.appspot.com",
  messagingSenderId: "878067367475",
  appId: "1:878067367475:web:8c2817e57d095d36aaad46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);