import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./client";

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function createAccount(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function changePassword(newPassword: string) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user logged in");
  }
  
  // Update password
  await updatePassword(user, newPassword);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
