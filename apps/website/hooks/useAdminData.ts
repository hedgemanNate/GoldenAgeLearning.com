"use client";
import { useState, useEffect } from "react";
import { subscribeToClasses, subscribeToBookings } from "../lib/firebase/db";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../lib/firebase/client";
import type { ClassWithId, Class } from "../types/class";
import type { BookingWithId } from "../types/booking";
import type { UserWithId, User } from "../types/user";

export function useAdminData() {
  const [classes, setClasses] = useState<ClassWithId[]>([]);
  const [bookings, setBookings] = useState<BookingWithId[]>([]);
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [classesLoaded, setClassesLoaded] = useState(false);
  const [bookingsLoaded, setBookingsLoaded] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);

  const loading = !classesLoaded || !bookingsLoaded || !usersLoaded;

  useEffect(() => {
    let unsubClasses: (() => void) | null = null;
    let unsubBookings: (() => void) | null = null;
    let unsubUsers: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      // Tear down previous subscriptions if auth state changes
      unsubClasses?.();
      unsubBookings?.();
      unsubUsers?.();

      if (!fbUser) {
        // Not signed in — resolve loading immediately with empty data
        setClasses([]);
        setBookings([]);
        setUsers([]);
        setClassesLoaded(true);
        setBookingsLoaded(true);
        setUsersLoaded(true);
        return;
      }

      unsubClasses = subscribeToClasses((c) => { setClasses(c); setClassesLoaded(true); });
      unsubBookings = subscribeToBookings(
        (b) => { setBookings(b); setBookingsLoaded(true); },
        () => { setBookings([]); setBookingsLoaded(true); }
      );
      unsubUsers = onValue(
        ref(db, "users"),
        (snap) => {
          setUsers(
            snap.exists()
              ? Object.entries(snap.val()).map(([uid, val]) => ({ uid, ...(val as User) }))
              : []
          );
          setUsersLoaded(true);
        },
        () => { setUsers([]); setUsersLoaded(true); }
      );
    });

    return () => {
      unsubAuth();
      unsubClasses?.();
      unsubBookings?.();
      unsubUsers?.();
    };
  }, []);

  return { classes, bookings, users, loading };
}
