"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { BookingCheckoutHeader } from "@/components/booking-engine/booking-checkout-header";
import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import { ConfirmationStep } from "@/components/booking-engine/steps/confirmation-step";
import { useBookingTour } from "@/components/booking-engine/booking-tour-context";
import type { BookingShipVisit } from "@/lib/booking/booking-ship-types";
import { trackBookingEvent } from "@/lib/payments/analytics";
import {
  verifyCheckoutSession,
  type VerifyCheckoutSessionResponse,
} from "@/lib/payments/client";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "pending"; data: VerifyCheckoutSessionResponse }
  | { status: "finalising"; data: VerifyCheckoutSessionResponse }
  | { status: "confirmed"; data: VerifyCheckoutSessionResponse };

function shipFromSession(data: VerifyCheckoutSessionResponse): BookingShipVisit {
  return {
    name: data.shipName || "Cruise ship",
    slug: data.metadata.ship_id || "unknown",
    cruiseLine: "",
    arrivalTime: null,
    departureTime: null,
    timesVerified: false,
  };
}

const MISSING_SESSION_MESSAGE =
  "Missing payment session. If you completed payment, contact us with your booking details — we will email your confirmation shortly.";

export function BookingSuccessClient() {
  const bookingPrototypeTour = useBookingTour();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<LoadState>(() =>
    sessionId
      ? { status: "loading" }
      : { status: "error", message: MISSING_SESSION_MESSAGE },
  );

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function verify() {
      try {
        const data = await verifyCheckoutSession(sessionId!);
        if (cancelled) return;

        if (data.paid) {
          trackBookingEvent("payment_succeeded", {
            excursionId: data.metadata.excursion_id,
            shipId: data.metadata.ship_id,
            sailingDate: data.excursionDate ?? undefined,
            guestCount: data.totalGuests ?? undefined,
            bookingValue:
              typeof data.amountTotal === "number"
                ? data.amountTotal / 100
                : undefined,
            currency: data.currency?.toUpperCase(),
            bookingReference: data.bookingReference ?? undefined,
          });

          if (data.bookingFinalised) {
            trackBookingEvent("booking_confirmed", {
              excursionId: data.metadata.excursion_id,
              bookingReference: data.bookingReference ?? undefined,
              sailingDate: data.excursionDate ?? undefined,
              guestCount: data.totalGuests ?? undefined,
            });
            setState({ status: "confirmed", data });
            return;
          }

          setState({ status: "finalising", data });
          return;
        }

        if (
          data.paymentStatus === "unpaid" ||
          data.sessionStatus === "open"
        ) {
          setState({ status: "pending", data });
          return;
        }

        setState({
          status: "error",
          message:
            "We could not confirm this payment yet. If you were charged, contact us with your details — we will email your confirmation shortly.",
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          status: "error",
          message:
            err instanceof Error
              ? err.message
              : "We could not verify your payment. Please contact us with your booking details.",
        });
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="flex flex-1 flex-col">
      <BookingCheckoutHeader mode="booking" />
      <div className="book-shell py-8 sm:py-12 lg:py-14">
        {state.status === "loading" ? (
          <p className="text-center text-[var(--book-muted)]" aria-live="polite">
            Confirming your payment…
          </p>
        ) : null}

        {state.status === "error" ? (
          <div className="mx-auto max-w-lg space-y-6 text-center">
            <h1 className="book-display text-3xl font-medium text-[var(--book-ink)]">
              Payment not confirmed
            </h1>
            <p className="text-[var(--book-muted)]">{state.message}</p>
            <BookingPrimaryButton
              onClick={() => {
                window.location.href = bookingPrototypeTour.bookingPath;
              }}
            >
              Return to booking
            </BookingPrimaryButton>
            <Link
              href={bookingPrototypeTour.path}
              className="inline-block text-sm text-[var(--book-muted)] hover:text-[var(--book-ink)]"
            >
              Back to tour details
            </Link>
          </div>
        ) : null}

        {state.status === "pending" ? (
          <div className="mx-auto max-w-lg space-y-6 text-center">
            <h1 className="book-display text-3xl font-medium text-[var(--book-ink)]">
              Payment processing
            </h1>
            <p className="text-[var(--book-muted)]">
              Your payment is still processing. This page is safe to refresh —
              we will confirm your booking once Stripe notifies us.
            </p>
            {state.data.bookingReference ? (
              <p className="font-medium text-[var(--book-ink)]">
                Reference: {state.data.bookingReference}
              </p>
            ) : null}
            <BookingPrimaryButton
              onClick={() => window.location.reload()}
            >
              Refresh status
            </BookingPrimaryButton>
          </div>
        ) : null}

        {state.status === "finalising" ? (
          <div className="mx-auto max-w-lg space-y-6 text-center">
            <h1 className="book-display text-3xl font-medium text-[var(--book-ink)]">
              Payment received — finalising your booking
            </h1>
            <p className="text-[var(--book-muted)]">
              Stripe has confirmed your payment. We are finishing your booking
              record — this page is safe to refresh in a moment.
            </p>
            {state.data.bookingReference ? (
              <p className="font-medium text-[var(--book-ink)]">
                Reference: {state.data.bookingReference}
              </p>
            ) : null}
            <BookingPrimaryButton onClick={() => window.location.reload()}>
              Refresh status
            </BookingPrimaryButton>
          </div>
        ) : null}

        {state.status === "confirmed" &&
        state.data.bookingReference &&
        state.data.excursionDate ? (
          <ConfirmationStep
            bookingReference={state.data.bookingReference}
            date={state.data.excursionDate}
            guests={state.data.totalGuests ?? 1}
            cruiseShip={shipFromSession(state.data)}
            customerEmail={state.data.customerEmail}
            onBookAgain={() => {
              window.location.href = bookingPrototypeTour.bookingPath;
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
