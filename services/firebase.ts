
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCvBuElRvz4BHEmlGCXLCJsZ1V4iULcMpo",
  authDomain: "molly-starr.firebaseapp.com",
  projectId: "molly-starr",
  storageBucket: "molly-starr.firebasestorage.app",
  messagingSenderId: "22332089138",
  appId: "1:22332089138:web:fa22e8466bf9ebd8aa2d2b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
