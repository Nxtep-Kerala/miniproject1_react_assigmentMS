import { auth, firestore } from './firebase-config';

export const registerUser = async (email, password, name, department, year, profilePic) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const appNumber = `${department}-${year}-${user.uid.substring(0, 5)}`;
    await firestore.collection('users').doc(user.uid).set({
      name,
      email,
      department,
      year,
      profilePic,
      appNumber
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
