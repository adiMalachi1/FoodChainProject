import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCIgVPIjan-hXZP_s-Q-wEZ2jYCVgEux9g",
  authDomain: "foodchainapp-ba424.firebaseapp.com",
  databaseURL: "https://foodchainapp-ba424-default-rtdb.firebaseio.com",
  projectId: "foodchainapp-ba424",
  storageBucket: "foodchainapp-ba424.appspot.com",
  messagingSenderId: "140597964292",
  appId: "1:140597964292:web:8c7b97bcf2da20b9784f51"
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