// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtuTPhVK_dzpnyBAb-PQgUCc7K70Wp5II",
  authDomain: "certificate-generator-d3122.firebaseapp.com",
  projectId: "certificate-generator-d3122",
  storageBucket: "certificate-generator-d3122.firebasestorage.app",
  messagingSenderId: "351816526634",
  appId: "1:351816526634:web:40aa6d734fc8f92caa4c53",
  measurementId: "G-JXSQ1PV0L9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);