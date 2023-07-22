import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKyd36JJ4c4YJlVeGnPuYk-Bc4wQOihcc",
  authDomain: "databasetest-5a447.firebaseapp.com",
  projectId: "databasetest-5a447",
  storageBucket: "databasetest-5a447.appspot.com",
  messagingSenderId: "512798885717",
  appId: "1:512798885717:web:3d6dfc3713fa3c383e91dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const db = getFirestore(app)

export {db}