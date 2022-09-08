// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';

const API_Key = process.env.REACT_APP_FIREBASE_API_KEY;
const firebaseConfig = {
    apiKey: API_Key,
    authDomain: "library-innocent-and-musical.firebaseapp.com",
    databaseURL: "https://library-innocent-and-musical-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "library-innocent-and-musical",
    storageBucket: "library-innocent-and-musical.appspot.com",
    messagingSenderId: "379044871325",
    appId: "1:379044871325:web:98a1c66babf9cdcd24a874",
    measurementId: "G-K0SQZ3TTH7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)