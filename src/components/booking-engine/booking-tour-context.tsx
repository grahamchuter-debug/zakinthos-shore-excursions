"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { BookingTourView } from "@/lib/booking/booking-config";

const BookingTourContext = createContext<BookingTourView | null>(null);

export function BookingTourProvider({
  tour,
  children,
}: {
  tour: BookingTourView;
  children: ReactNode;
}) {
  return (
    <BookingTourContext.Provider value={tour}>{children}</BookingTourContext.Provider>
  );
}

export function useBookingTour(): BookingTourView {
  const tour = useContext(BookingTourContext);
  if (!tour) {
    throw new Error("useBookingTour must be used within BookingTourProvider");
  }
  return tour;
}
