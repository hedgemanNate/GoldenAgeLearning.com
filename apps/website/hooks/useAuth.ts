"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../lib/firebase/client";
import { getUser, createUser } from "../lib/firebase/db";
import type { UserWithId } from "../types";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserWithId | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        let profile = await getUser(fbUser.uid);
        
        // If user doesn't have a profile yet, create one
        if (!profile) {
          await createUser(fbUser.uid, {
            email: fbUser.email || null,
            name: fbUser.displayName || "",
            phone: null,
            address: null,
            role: "customer",
            notes: null,
            contact: [],
            discounts: [],
            starRating: null,
            profilePicture: null,
            totalRedemptions: 0,
            squareCustomerId: null,
            squareCardId: null,
            createdAt: Date.now(),
            lastLoginAt: null,
          });
          profile = await getUser(fbUser.uid);
        }
        
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { firebaseUser, user, loading };
}
