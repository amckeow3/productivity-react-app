import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDDHv9Cy4AKDdwKnBp-3LHqN2Ejr3t9GA",
  authDomain: "productivity-react-app.firebaseapp.com",
  projectId: "productivity-react-app",
  storageBucket: "productivity-react-app.appspot.com",
  messagingSenderId: "266618494630",
  appId: "1:266618494630:web:192de2963741d58b749e67",
  measurementId: "G-ELTZ16KJN2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
