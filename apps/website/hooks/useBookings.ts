"use client";
import { useState, useEffect } from "react";
import { subscribeToBookings } from "../lib/firebase/db";
import type { BookingWithId, BookingStatus } from "../types";

export function useBookings(statusFilter?: BookingStatus) {
  const [bookings, setBookings] = useState<BookingWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToBookings((all) => {
      setBookings(statusFilter ? all.filter((b) => b.status === statusFilter) : all);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [statusFilter]);

  return { bookings, loading };
}
