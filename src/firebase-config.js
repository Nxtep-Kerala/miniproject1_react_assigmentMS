
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyAnKDz-P5d7YoOWjGJkf-ZwG7CPBb0JUnI",
  authDomain: "miniproject-44c41.firebaseapp.com",
  databaseURL: "https://miniproject-44c41-default-rtdb.firebaseio.com",
  projectId: "miniproject-44c41",
  storageBucket: "miniproject-44c41.appspot.com",
  messagingSenderId: "18195475421",
  appId: "1:18195475421:web:38c1dc9ac6481807dd6434",
  measurementId: "G-ZLP8HMQ0Z6"
};

firebase.initializeApp(firebaseConfig);
export const dataRef = firebase.database();
export default firebase;
