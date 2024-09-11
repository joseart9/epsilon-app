// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZI2cIj9Zifq4S82IaakOEb_D144EHIjE",
  authDomain: "epsilondb-f0222.firebaseapp.com",
  projectId: "epsilondb-f0222",
  storageBucket: "epsilondb-f0222.appspot.com",
  messagingSenderId: "202399773320",
  appId: "1:202399773320:web:f5518f8463502efed3253d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

export { storage };

export default app;
