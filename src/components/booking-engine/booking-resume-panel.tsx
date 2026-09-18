"use client";

import { useEffect, useId, useRef } from "react";

import {
  BookingPrimaryButton,
} from "@/components/booking-engine/booking-primary-button";
import {
  formatBookingDate,
} from "@/lib/booking/booking-format";

type BookingResumePanelProps = {
  open: boolean;
  date: string;
  shipName: string;
  guests: number;
  onContinueToPayment: () => void;
  onReview: () => void;
  onStartAgain: () => void;
};

/**
 * Shown when Book Now (or a refresh) finds a payment-ready session so we
 * never force straight to checkout without a conscious choice.
 */
export function BookingResumePanel({
  open,
  date,
  shipName,
  guests,
  onContinueToPayment,
  onReview,
  onStartAgain,
}: BookingResumePanelProps) {
  const titleId = useId();
  const primaryRef = useRef<HTMLButtonElement>(null);
  const confirmStartAgain = () => {
    const confirmed = window.confirm(
      "Start again and clear your current date, ship, and guest selections?",
    );
    if (confirmed) onStartAgain();
  };

  useEffect(() => {
    if (!open) return;
    primaryRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onReview();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onReview]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--book-ink)]/45 px-4 py-6 sm:items-center sm:p-6"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-[1.5rem] border border-[var(--book-line)] bg-[var(--book-surface)] p-6 shadow-[0_28px_80px_-36px_rgba(12,26,36,0.55)] sm:p-8"
      >
        <p className="text-[11px] font-medium tracking-[0.16em] text-[var(--book-muted)] uppercase">
          Booking in progress
        </p>
        <h2
          id={titleId}
          className="book-display mt-2 text-2xl font-medium text-[var(--book-ink)] sm:text-3xl"
        >
          You already have a booking in progress.
        </h2>
        <p className="mt-3 text-[15px] leading-6 text-[var(--book-muted)]">
          {formatBookingDate(date)} · {shipName} · {guests}{" "}
          {guests === 1 ? "guest" : "guests"}
        </p>

        <div className="mt-8 space-y-3">
          <BookingPrimaryButton
            ref={primaryRef}
            onClick={onContinueToPayment}
            className="sm:w-full"
          >
            Continue to payment
          </BookingPrimaryButton>
          <BookingPrimaryButton
            variant="secondary"
            onClick={onReview}
            className="sm:w-full"
          >
            Review or change booking
          </BookingPrimaryButton>
          <BookingPrimaryButton
            variant="ghost"
            onClick={confirmStartAgain}
            className="sm:w-full"
          >
            Start again
          </BookingPrimaryButton>
        </div>
      </div>
    </div>
  );
}
