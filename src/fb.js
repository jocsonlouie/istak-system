// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBSy-RzIaNaJo6qRnl-5yf0Zs1lrWcaoTQ",
    authDomain: "istak-2208e.firebaseapp.com",
    projectId: "istak-2208e",
    storageBucket: "istak-2208e.appspot.com",
    messagingSenderId: "793410231092",
    appId: "1:793410231092:web:369892710d10b95b90e361",
    measurementId: "G-0EBWD1422C"
};

// Initialize Firebase
const db = initializeApp(firebaseConfig);

db.settings({ timestampsInSnapshots: true });

const analytics = getAnalytics(app);

export default db;