import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
