"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface BookingState {
  classId: string | null;
  customerId: string | null;
  paymentMethod: "card" | "cash" | null;
  step: number;
}

interface BookingContextValue {
  booking: BookingState;
  setBooking: (data: Partial<BookingState>) => void;
  resetBooking: () => void;
}

const INITIAL: BookingState = {
  classId: null,
  customerId: null,
  paymentMethod: null,
  step: 0,
};

const BookingContext = createContext<BookingContextValue>({
  booking: INITIAL,
  setBooking: () => {},
  resetBooking: () => {},
});

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBookingState] = useState<BookingState>(INITIAL);

  function setBooking(data: Partial<BookingState>) {
    setBookingState((prev) => ({ ...prev, ...data }));
  }

  function resetBooking() {
    setBookingState(INITIAL);
  }

  return (
    <BookingContext.Provider value={{ booking, setBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  return useContext(BookingContext);
}
