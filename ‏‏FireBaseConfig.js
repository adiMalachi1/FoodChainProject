import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAF0FeQYSfcVAqQHnRWjMJhwiCwu0mzsl0",
  authDomain: "foodchainproject-ec30e.firebaseapp.com",
  projectId: "foodchainproject-ec30e",
  storageBucket: "foodchainproject-ec30e.appspot.com",
  messagingSenderId: "53743036595",
  appId: "1:53743036595:web:834e0ca4ccdaddbb0ce8c6"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };