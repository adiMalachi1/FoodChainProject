import 'react-native-gesture-handler';
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyAF0FeQYSfcVAqQHnRWjMJhwiCwu0mzsl0",
  authDomain: "foodchainproject-ec30e.firebaseapp.com",
  projectId: "foodchainproject-ec30e",
  storageBucket: "gs://foodchainproject-ec30e.appspot.com",
  messagingSenderId: "53743036595",
  appId: "1:53743036595:web:834e0ca4ccdaddbb0ce8c6",
  databaseURL: "https://foodchainproject-ec30e-default-rtdb.europe-west1.firebasedatabase.app/",
};

if (firebase.apps.length === 0) 
 firebase.initializeApp(firebaseConfig)

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage()
export { db, auth,storage };