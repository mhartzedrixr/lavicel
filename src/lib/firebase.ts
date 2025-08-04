'use client';

import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'lavicel-eticket',
  appId: '1:744489292981:web:33a248ffd43c76b2ba9afc',
  storageBucket: 'lavicel-eticket.firebasestorage.app',
  apiKey: 'AIzaSyDkJNKOErTgp3Clc-6QR4ZC398kGJ9Yx8Y',
  authDomain: 'lavicel-eticket.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '744489292981',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};
