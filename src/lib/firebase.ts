import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgnoar5Wqv2UsYw9TSCuV3omSQXvT7IcA",
  authDomain: "beautylandapp-896de.firebaseapp.com",
  projectId: "beautylandapp-896de",
  storageBucket: "beautylandapp-896de.appspot.com",
  messagingSenderId: "544616799175",
  appId: "1:544616799175:web:91e7adbb7a04f16bad57e2",
  measurementId: "G-4F7X2XG2ZF",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
