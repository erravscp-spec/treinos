import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB-UWGBH8hg51GJKK1c-rCvKIpOQrd1rtk",
  authDomain: "treinos-7d772.firebaseapp.com",
  databaseURL: "https://treinos-7d772-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "treinos-7d772",
  storageBucket: "treinos-7d772.firebasestorage.app",
  messagingSenderId: "1057736081310",
  appId: "1:1057736081310:web:57aff7204cf61e2a78a08f",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
