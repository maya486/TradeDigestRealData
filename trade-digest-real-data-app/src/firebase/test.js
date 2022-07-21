import {
  getFirestore,
  getDocs,
  collection,
  where,
  query,
  writeBatch,
  doc,
} from "firebase/compat/firestore";
import * as firebase from "firebase/compat/app";
// import { initializeApp } from "firebase/app";
// import app from "./firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_apiId,
  measurementId: process.env.REACT_APP_measurementId,
};

const createFirebaseApp = () => {
  return firebase.initializeApp(firebaseConfig);
};

const db = getFirestore(createFirebaseApp());

export const getSchedules = async () => {
  const scheduleRef = collection(db, "schedule");
  const scheduleQuery = await query(scheduleRef);

  const querySnapshot = await getDocs(scheduleQuery);

  const result = [];

  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });

  return result;
};
