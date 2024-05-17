
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD1wYBETr0ys1WKEWO9-y-SN3yC6K3mE_c",
    authDomain: "creativity-app-51d79.firebaseapp.com",
    projectId: "creativity-app-51d79",
    storageBucket: "creativity-app-51d79.appspot.com",
    messagingSenderId: "259662114578",
    appId: "1:259662114578:web:3864e643670fd88966cdcb"
  };

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };

