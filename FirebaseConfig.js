import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import database from 'firebase/compat/database'

// import database from '@react-native-firebase/database'
const firebaseConfig = {
  apiKey: "AIzaSyAF0FeQYSfcVAqQHnRWjMJhwiCwu0mzsl0",
  authDomain: "foodchainproject-ec30e.firebaseapp.com",
  projectId: "foodchainproject-ec30e",
  storageBucket: "foodchainproject-ec30e.appspot.com",
  messagingSenderId: "53743036595",
  appId: "1:53743036595:web:834e0ca4ccdaddbb0ce8c6",
  databaseURL: "https://foodchainproject-ec30e-default-rtdb.europe-west1.firebasedatabase.app/",
};


if (firebase.apps.length === 0) 
 firebase.initializeApp(firebaseConfig)

const db = firebase.database();
const auth = firebase.auth();

export { db, auth };