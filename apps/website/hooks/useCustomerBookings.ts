"use client";
import { useState, useEffect } from "react";
import { subscribeToCustomerBookings } from "../lib/firebase/db";
import type { BookingWithId } from "../types";

export function useCustomerBookings(customerId: string | null) {
  const [bookings, setBookings] = useState<BookingWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) {
      setBookings([]);
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToCustomerBookings(customerId, (b) => {
      setBookings(b);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [customerId]);

  return { bookings, loading };
}
