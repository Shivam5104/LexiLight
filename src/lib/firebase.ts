
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "studio-7867367931-be0c2",
  appId: "1:769578210555:web:543cbf613cec3c5dcbcc5e",
  apiKey: "AIzaSyCmV4fwNMEoo7QuMHh7D8wqDiGtfzI80ro",
  authDomain: "studio-7867367931-be0c2.firebaseapp.com",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
