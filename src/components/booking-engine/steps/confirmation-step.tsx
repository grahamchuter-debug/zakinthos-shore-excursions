"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import { useBookingTour } from "@/components/booking-engine/booking-tour-context";
import type { BookingShipVisit } from "@/lib/booking/booking-ship-types";
import {
  formatBookingDate,
  formatBookingMoney,
  calculateBookingTotal,
} from "@/lib/booking/booking-format";
import { businessIdentity } from "@/lib/legal/business-identity";

type ConfirmationStepProps = {
  bookingReference: string;
  date: string;
  guests: number;
  cruiseShip: BookingShipVisit;
  customerEmail?: string | null;
  onBookAgain: () => void;
};

const fieldClass =
  "w-full rounded-xl border border-[var(--book-line)] bg-white px-4 py-3.5 text-base text-[var(--book-ink)] outline-none focus:border-[var(--book-sea)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]";

export function ConfirmationStep({
  bookingReference,
  date,
  guests,
  cruiseShip,
  customerEmail,
  onBookAgain,
}: ConfirmationStepProps) {
  const bookingPrototypeTour = useBookingTour();
  const formId = useId();
  const [cruiseSaved, setCruiseSaved] = useState(false);

  const handleCruiseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCruiseSaved(true);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <section className="overflow-hidden rounded-[1.75rem] bg-[var(--book-surface)] text-center shadow-[0_30px_80px_-40px_rgba(12,26,36,0.4)]">
        <div className="relative min-h-[14rem] overflow-hidden sm:min-h-[18rem]">
          <img
            src={bookingPrototypeTour.checkoutReconnectImage}
            alt={bookingPrototypeTour.checkoutReconnectImageAlt || "Zakynthos waterfront and Ionian Sea"}
            width={1920}
            height={1256}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[var(--book-ink)]/55" />
          <div className="relative flex h-full min-h-[14rem] flex-col items-center justify-center px-6 py-12 text-white sm:min-h-[18rem] sm:px-10">
            <p className="mb-3 text-[11px] font-medium tracking-[0.2em] text-white/70 uppercase">
              {businessIdentity.tradingName}
            </p>
            <h2 className="book-display max-w-xl text-3xl font-medium leading-tight sm:text-5xl">
              Your Zakynthos day awaits
            </h2>
            <p className="mt-5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              {bookingReference}
            </p>
          </div>
        </div>

        <div className="space-y-8 px-6 py-10 text-left sm:px-10">
          <p className="text-center text-[15px] leading-7 text-[var(--book-muted)] sm:text-left">
            Booking confirmed. We are preparing your meeting details and will
            email your confirmation shortly
            {customerEmail ? (
              <>
                {" "}
                to{" "}
                <span className="font-medium text-[var(--book-ink)]">
                  {customerEmail}
                </span>
              </>
            ) : null}
            .
          </p>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-[var(--book-muted)] uppercase">
                Booking reference
              </dt>
              <dd className="mt-1 font-medium text-[var(--book-ink)]">
                {bookingReference}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-[var(--book-muted)] uppercase">
                Experience
              </dt>
              <dd className="mt-1 font-medium text-[var(--book-ink)]">
                {bookingPrototypeTour.name}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-[var(--book-muted)] uppercase">
                Date
              </dt>
              <dd className="mt-1 font-medium text-[var(--book-ink)]">
                {formatBookingDate(date)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-[var(--book-muted)] uppercase">
                Cruise ship
              </dt>
              <dd className="mt-1 font-medium text-[var(--book-ink)]">
                {cruiseShip.name}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-[var(--book-muted)] uppercase">
                Guests
              </dt>
              <dd className="mt-1 font-medium text-[var(--book-ink)]">
                {guests} {guests === 1 ? "guest" : "guests"} ·{" "}
                {formatBookingMoney(calculateBookingTotal(guests))}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-[var(--book-muted)] uppercase">
                Local excursion provider
              </dt>
              <dd className="mt-1 font-medium text-[var(--book-ink)]">
                {businessIdentity.localProviderPlaceholder}
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl bg-[var(--book-mist)] px-5 py-6">
            <h3 className="book-display text-2xl font-medium text-[var(--book-ink)]">
              What happens next
            </h3>
            <ol className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--book-muted)]">
              <li>
                We prepare meeting details for {cruiseShip.name} at Villefranche
                Cruise Port.
              </li>
              <li>
                Closer to port day, you receive exact meeting instructions.
              </li>
              <li>
                On the day, your guide meets you ashore and returns you with
                time for your ship.
              </li>
            </ol>
          </div>

          <div className="space-y-3 border-t border-[var(--book-line)] pt-6 text-sm leading-6 text-[var(--book-muted)]">
            <p>
              Questions about this booking?{" "}
              <a
                href={businessIdentity.customerServiceEmailHref}
                className="book-text-link font-medium underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
              >
                {businessIdentity.customerServiceEmail}
              </a>
            </p>
            <p>
              Cancellation terms:{" "}
              <Link
                href="/cancellation-policy"
                className="book-text-link font-medium underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
              >
                Cancellation Policy
              </Link>
            </p>
            <p className="text-xs leading-5 text-[var(--book-muted)]">
              {businessIdentity.companyDisclosure}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-[var(--book-line)] bg-[var(--book-surface)] p-6 sm:p-8">
        <p className="text-[11px] font-medium tracking-[0.16em] text-[var(--book-muted)] uppercase">
          Optional · after booking
        </p>
        <h3 className="book-display mt-2 text-2xl font-medium text-[var(--book-ink)] sm:text-3xl">
          Add notes for your guide
        </h3>
        <p className="mt-2 max-w-xl text-[15px] leading-7 text-[var(--book-muted)]">
          Your phone number was collected during payment. Use this only for
          optional notes about {cruiseShip.name}.
        </p>

        {cruiseSaved ? (
          <div
            className="mt-6 rounded-xl bg-[var(--book-success)]/10 px-4 py-4 text-[var(--book-success)]"
            role="status"
          >
            <p className="font-medium">Thank you — details noted.</p>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleCruiseSubmit}>
            <div>
              <label
                htmlFor={`${formId}-notes`}
                className="mb-1.5 block text-sm text-[var(--book-muted)]"
              >
                Notes for your guide (optional)
              </label>
              <textarea
                id={`${formId}-notes`}
                name="notes"
                rows={3}
                className={fieldClass}
              />
            </div>
            <BookingPrimaryButton type="submit">Save details</BookingPrimaryButton>
          </form>
        )}
      </section>

      <div className="mx-auto max-w-md space-y-3 text-center">
        <BookingPrimaryButton onClick={onBookAgain}>
          Book another day
        </BookingPrimaryButton>
        <Link
          href={bookingPrototypeTour.path}
          className="inline-block text-sm font-medium text-[var(--book-muted)] hover:text-[var(--book-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
        >
          Back to tour details
        </Link>
      </div>
    </div>
  );
}
