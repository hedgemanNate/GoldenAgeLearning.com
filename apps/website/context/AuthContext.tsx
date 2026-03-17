"use client";
import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { UserWithId } from "../types";
import type { User as FirebaseUser } from "firebase/auth";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  user: UserWithId | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
