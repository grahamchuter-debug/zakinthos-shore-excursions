"use client";

import { useEffect, useRef } from "react";

import {
  BookingBackLink,
  BookingPrimaryButton,
} from "@/components/booking-engine/booking-primary-button";
import {
  bookingCapacityConfig,
  bookingCheckoutGuestLimit,
  bookingPricingConfig,
} from "@/lib/booking/booking-config";
import {
  calculateBookingTotal,
  formatBookingMoney,
} from "@/lib/booking/booking-format";
import { useBookingTour } from "@/components/booking-engine/booking-tour-context";

type GuestsStepProps = {
  guests: number;
  onChangeGuests: (guests: number) => void;
  onContinue: () => void;
  onBack: () => void;
  selectedDateLabel?: string | null;
  cruiseShipName?: string | null;
  /** Optional verified Arrives / Departs line from the central schedule */
  cruiseShipTimingLine?: string | null;
  continueLabel?: string;
};

export function GuestsStep({
  guests,
  onChangeGuests,
  onContinue,
  onBack,
  selectedDateLabel,
  cruiseShipName,
  cruiseShipTimingLine,
  continueLabel = "Continue to secure payment",
}: GuestsStepProps) {
  const tour = useBookingTour();
  const { minGuests, capacityLabel, overCapacityContactHref } =
    bookingCapacityConfig;
  const maxGuests = bookingCheckoutGuestLimit;
  const total = calculateBookingTotal(guests, tour.pricePerGuest);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <BookingBackLink onClick={onBack} className="mb-6 sm:mb-8" />

      <div className="lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
        <div>
          <header className="space-y-3 text-center lg:text-left">
            <h2
              ref={headingRef}
              tabIndex={-1}
              id="booking-guests-heading"
              className="book-display text-4xl font-medium text-[var(--book-ink)] outline-none sm:text-5xl"
            >
              How many guests?
            </h2>
            <p className="text-lg text-[var(--book-muted)] lg:max-w-sm">
              {capacityLabel}
            </p>
            {cruiseShipName || selectedDateLabel ? (
              <div className="space-y-1 text-sm text-[var(--book-muted)]">
                <p>
                  {[cruiseShipName, selectedDateLabel]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {cruiseShipTimingLine ? (
                  <p className="text-[13px] leading-5 text-[var(--book-muted)]">
                    {cruiseShipTimingLine}
                  </p>
                ) : null}
              </div>
            ) : null}
          </header>

          <div
            className="mt-10 flex items-center justify-center gap-8 sm:gap-12 lg:mt-12 lg:justify-start"
            role="group"
            aria-labelledby="guest-count-label"
          >
            <button
              type="button"
              aria-label="Fewer guests"
              disabled={guests <= minGuests}
              onClick={() => onChangeGuests(Math.max(minGuests, guests - 1))}
              className="book-guest-control flex h-14 w-14 items-center justify-center rounded-full border border-[var(--book-line)] text-2xl text-[var(--book-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)] disabled:opacity-30"
            >
              −
            </button>
            <div className="min-w-[6rem] text-center">
              <p
                id="guest-count-label"
                key={guests}
                className="book-guest-count book-display text-7xl font-medium leading-none text-[var(--book-ink)]"
                aria-live="polite"
              >
                {guests}
              </p>
              <p className="mt-3 text-sm tracking-wide text-[var(--book-muted)]">
                {guests === 1 ? "guest" : "guests"}
              </p>
            </div>
            <button
              type="button"
              aria-label="More guests"
              disabled={guests >= maxGuests}
              onClick={() => onChangeGuests(Math.min(maxGuests, guests + 1))}
              className="book-guest-control flex h-14 w-14 items-center justify-center rounded-full border border-[var(--book-line)] text-2xl text-[var(--book-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)] disabled:opacity-30"
            >
              +
            </button>
          </div>

          <p className="mx-auto mt-8 max-w-md text-center text-sm leading-6 text-[var(--book-muted)] lg:mx-0 lg:text-left">
            Travelling with more than six people?{" "}
            <a
              href={overCapacityContactHref}
              className="book-text-link underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--w2-focus-ring)]"
            >
              Contact us
            </a>{" "}
            and we&apos;ll check additional vehicle availability.
          </p>
        </div>

        <div className="mt-12 border-t border-[var(--book-line)] pt-8 lg:mt-0 lg:border-t-0 lg:border-l lg:pl-12 lg:pt-0">
          <p className="text-[11px] font-medium tracking-[0.16em] text-[var(--book-muted)] uppercase">
            Price
          </p>
          <p className="mt-2 text-sm text-[var(--book-muted)]">
            {formatBookingMoney(tour.pricePerGuest)} × {guests}
          </p>
          <p
            key={total}
            className="book-guest-count book-display mt-1 text-4xl font-medium text-[var(--book-ink)] sm:text-5xl"
          >
            {formatBookingMoney(total)}
          </p>

          <div className="mt-8">
            <BookingPrimaryButton onClick={onContinue} className="sm:w-full">
              {continueLabel}
            </BookingPrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
