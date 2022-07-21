import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";

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
  try {
    const scheduleRef = collection(db, "schedule");
    const scheduleQuery = await query(scheduleRef);

    const querySnapshot = await getDocs(scheduleQuery);

    const result = [];

    querySnapshot.forEach((doc) => {
      result.push(doc.data());
    });

    return result;
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};
