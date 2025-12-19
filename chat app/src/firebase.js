import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";

// Using Vite environment variables (must start with VITE_)
const firebaseConfig = {
    apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// --- Helper Functions for Database Operations ---

// 1. Send data to database
export const sendDataToDatabase = async (collectionName, data) => {
    // Validation: Check if API key is loaded
    if (!firebaseConfig.apiKey) {
        throw new Error("CONFIGURATION ERROR: Firebase API Key is missing. Check your .env file and ensure variables start with VITE_.");
    }

    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

// 2. Retrieve data (One-time fetch)
export const getDataFromDatabase = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const dataList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return dataList;
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw e;
    }
};

// 3. Listen for real-time updates
export const subscribeToData = (collectionName, callback) => {
    const unsubscribe = onSnapshot(collection(db, collectionName), (querySnapshot) => {
        const dataList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(dataList);
    });
    return unsubscribe;
};
