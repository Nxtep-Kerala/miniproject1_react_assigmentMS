
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyBGlEVOs9QJQGqZuGXRQbOjhBbcShk7Zo0",
  authDomain: "sneha-6651f.firebaseapp.com",
  databaseURL: "https://sneha-6651f-default-rtdb.firebaseio.com/",
  projectId: "sneha-6651f",
  storageBucket: "sneha-6651f.appspot.com",
  messagingSenderId: "85947020904",
  appId: "1:85947020904:web:c7dfaaf83fbbbc3f7aaddd",
  measurementId: "G-G45E7TKTGP"
};

firebase.initializeApp(firebaseConfig);
export const dataRef = firebase.database();
export default firebase;
