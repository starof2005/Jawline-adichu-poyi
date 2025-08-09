// app.js - Firebase initialization (v9 Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBLCfnv4Zc5S4zjouhOC8Yx3yq1Sp1XqF8",
    authDomain: "chew-a7f8e.firebaseapp.com",
    databaseURL: "https://chew-a7f8e-default-rtdb.firebaseio.com",
    projectId: "chew-a7f8e",
    storageBucket: "chew-a7f8e.appspot.com",
    messagingSenderId: "289328263335",
    appId: "1:289328263335:web:e46a1705b19d70e8f7ab82",
    measurementId: "G-L33CTHR129"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
