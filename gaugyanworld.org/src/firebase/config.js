// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJDiERqq6bzMT2TFJjq6gHarNDQr391Dk",
  authDomain: "gaugyan-2f059.firebaseapp.com",
  projectId: "gaugyan-2f059",
  storageBucket: "gaugyan-2f059.firebasestorage.app",
  messagingSenderId: "784847571076",
  appId: "1:784847571076:web:742bd5747b3ed6bdc4dad1",
  measurementId: "G-4W9YE36X3H"
};

// Initialize Firebase
// Initialize Firebase
let app;
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}
export const auth = getAuth(app);
export default app;
