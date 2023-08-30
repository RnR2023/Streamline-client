import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBNEt6sC_Her491fTfNOrCw6aBHGtCJvGk",
  authDomain: "streamline-waterlevel.firebaseapp.com",
  databaseURL: "https://streamline-waterlevel-default-rtdb.firebaseio.com",
  projectId: "streamline-waterlevel",
  storageBucket: "streamline-waterlevel.appspot.com",
  messagingSenderId: "1008365405346",
  appId: "1:1008365405346:web:ddc7d2754b8e856ef283fb",
  measurementId: "G-LBGKNFDKE1",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
