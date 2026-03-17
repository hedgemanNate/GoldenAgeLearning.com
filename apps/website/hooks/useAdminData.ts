"use client";
import { useState, useEffect } from "react";
import { subscribeToClasses, subscribeToBookings } from "../lib/firebase/db";
import { ref, onValue } from "firebase/database";
import { db } from "../lib/firebase/client";
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
    const unsubClasses = subscribeToClasses((c) => { setClasses(c); setClassesLoaded(true); });
    const unsubBookings = subscribeToBookings((b) => { setBookings(b); setBookingsLoaded(true); });
    const unsubUsers = onValue(ref(db, "users"), (snap) => {
      setUsers(
        snap.exists()
          ? Object.entries(snap.val()).map(([uid, val]) => ({ uid, ...(val as User) }))
          : []
      );
      setUsersLoaded(true);
    });
    return () => {
      unsubClasses();
      unsubBookings();
      unsubUsers();
    };
  }, []);

  return { classes, bookings, users, loading };
}
