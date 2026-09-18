"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import { BookingCheckoutHeader } from "@/components/booking-engine/booking-checkout-header";
import { BookingProgress } from "@/components/booking-engine/booking-progress";
import { BookingResumePanel } from "@/components/booking-engine/booking-resume-panel";
import { DateStep } from "@/components/booking-engine/steps/date-step";
import { GuestsStep } from "@/components/booking-engine/steps/guests-step";
import { formatVerifiedShipTimingLine } from "@/lib/booking/booking-ship-types";
import { PaymentStep } from "@/components/booking-engine/steps/payment-step";
import { ShipStep } from "@/components/booking-engine/steps/ship-step";
import { TourIntroStep } from "@/components/booking-engine/steps/tour-intro-step";
import {bookingCapacityConfig,bookingCheckoutGuestLimit,bookingSessionStorageKey,type BookingStepId} from "@/lib/booking/booking-config";
import { useBookingTour } from "@/components/booking-engine/booking-tour-context";
import { formatBookingDate } from "@/lib/booking/booking-format";
import {
  isCustomBookingShip,
  type BookingShipVisit,
  type BookingShipsByDate,
} from "@/lib/booking/booking-ship-types";
import { trackBookingEvent } from "@/lib/payments/analytics";

type BookingState = {
  step: BookingStepId;
  date: string | null;
  cruiseShip: BookingShipVisit | null;
  guests: number;
  bookingReference: string | null;
  /** Stable client session id for Stripe idempotency / metadata. */
  bookingSessionId: string;
  /** Editing from payment — return there after the edit path completes. */
  returnToPayment: boolean;
};

type BookingEngineProps = {
  shipsByDate: BookingShipsByDate;
};

const VALID_STEPS = new Set<BookingStepId>([
  "tour",
  "date",
  "ship",
  "guests",
  "payment",
]);

function createBookingSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess-${Date.now().toString(36)}`;
}

const HERO_EXIT_MS = 720;
const DATE_TO_GUESTS_ENTER = "book-step-enter-forward";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isShipVisit(value: unknown): value is BookingShipVisit {
  if (!value || typeof value !== "object") return false;
  const ship = value as BookingShipVisit;
  return (
    typeof ship.name === "string" &&
    typeof ship.slug === "string" &&
    typeof ship.cruiseLine === "string" &&
    (ship.isCustom === undefined || typeof ship.isCustom === "boolean")
  );
}

function clampGuests(guests: number): number {
  return Math.min(
    bookingCheckoutGuestLimit,
    Math.max(bookingCapacityConfig.minGuests, guests),
  );
}

function resolveShipForDate(
  ship: BookingShipVisit | null,
  shipsForDate: readonly BookingShipVisit[],
): BookingShipVisit | null {
  if (!ship) return null;
  if (isCustomBookingShip(ship)) return ship;
  return shipsForDate.find((candidate) => candidate.slug === ship.slug) ?? null;
}

/** Payment-ready session that should offer a resume choice on re-entry. */
function shouldOfferResume(state: BookingState): boolean {
  if (state.step === "tour") return false;
  if (state.returnToPayment) return false;
  if (!state.date || !state.cruiseShip) return false;
  return state.step === "payment" || state.step === "guests";
}

function loadState(storageKey: string, legacyKeys: readonly string[]): BookingState | null {
  if (typeof window === "undefined") return null;
  try {
    for (const key of legacyKeys) {
      window.sessionStorage.removeItem(key);
    }
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      step: string;
      date: string | null;
      cruiseShip?: unknown;
      guests: number;
      bookingReference: string | null;
      bookingSessionId?: string;
      returnToPayment?: boolean;
    };
    if (parsed.step === "summary" || parsed.step === "confirmed") {
      parsed.step = "payment";
    }
    if (!VALID_STEPS.has(parsed.step as BookingStepId)) {
      parsed.step = "tour";
    }
    const guests =
      typeof parsed.guests === "number"
        ? clampGuests(parsed.guests)
        : initialState.guests;
    return {
      step: parsed.step as BookingStepId,
      date: parsed.date,
      cruiseShip: isShipVisit(parsed.cruiseShip) ? parsed.cruiseShip : null,
      guests,
      bookingReference: parsed.bookingReference,
      bookingSessionId:
        typeof parsed.bookingSessionId === "string" && parsed.bookingSessionId
          ? parsed.bookingSessionId
          : createBookingSessionId(),
      returnToPayment: Boolean(parsed.returnToPayment),
    };
  } catch {
    return null;
  }
}

function saveState(storageKey: string, state: BookingState) {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Ignore quota / private mode
  }
}

const initialState: BookingState = {
  step: "tour",
  date: null,
  cruiseShip: null,
  guests: 2,
  bookingReference: null,
  bookingSessionId: "",
  returnToPayment: false,
};

export function BookingEngine({ shipsByDate }: BookingEngineProps) {
  const bookingPrototypeTour = useBookingTour();
  const STORAGE_KEY = bookingSessionStorageKey(bookingPrototypeTour.id);
  const LEGACY_KEYS = [
    "vf-booking-prototype-v1",
    `sv-booking:${bookingPrototypeTour.id}`,
  ] as const;
  const [state, setState] = useState<BookingState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [heroExiting, setHeroExiting] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [checkoutCancelled, setCheckoutCancelled] = useState(false);
  const heroExitTimer = useRef<number | null>(null);
  const startedTracked = useRef(false);

  useEffect(() => {
    const stored = loadState(STORAGE_KEY, LEGACY_KEYS);
    const params = new URLSearchParams(window.location.search);
    const cancelled = params.get("checkout") === "cancelled";

    startTransition(() => {
      if (cancelled) {
        setCheckoutCancelled(true);
        window.history.replaceState({}, "", window.location.pathname);
      }

      if (stored) {
        if (
          stored.cruiseShip &&
          stored.date &&
          !isCustomBookingShip(stored.cruiseShip)
        ) {
          const match = shipsByDate[stored.date]?.find(
            (ship) => ship.slug === stored.cruiseShip?.slug,
          );
          if (match) stored.cruiseShip = match;
          else {
            stored.cruiseShip = null;
            if (stored.step === "payment") stored.step = "ship";
          }
        }

        if (cancelled && stored.date && stored.cruiseShip) {
          setState({
            ...stored,
            step: "payment",
            returnToPayment: false,
          });
        } else if (shouldOfferResume(stored) && !cancelled) {
          setResumeOpen(true);
          setState({ ...stored, step: "tour", returnToPayment: false });
        } else {
          setState(stored);
        }
      } else {
        setState({
          ...initialState,
          bookingSessionId: createBookingSessionId(),
        });
      }
      setHydrated(true);
    });
  }, [shipsByDate]);

  useEffect(() => {
    if (!hydrated || startedTracked.current) return;
    startedTracked.current = true;
    trackBookingEvent("booking_started", {
      excursionId: bookingPrototypeTour.id,
    });
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveState(STORAGE_KEY, state);
  }, [state, hydrated, STORAGE_KEY]);

  useEffect(() => {
    if (!hydrated) return;
    if (state.step === "tour") return;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [state.step, hydrated]);

  useEffect(() => {
    return () => {
      if (heroExitTimer.current !== null) {
        window.clearTimeout(heroExitTimer.current);
      }
    };
  }, []);

  const shipsForSelectedDate = useMemo(() => {
    if (!state.date) return [] as BookingShipVisit[];
    return shipsByDate[state.date] ?? [];
  }, [shipsByDate, state.date]);

  /** Re-bind selected ship from current schedule so times/images stay authoritative. */
  useEffect(() => {
    if (!state.date || !state.cruiseShip) return;
    if (isCustomBookingShip(state.cruiseShip)) return;
    const match = shipsForSelectedDate.find(
      (ship) => ship.slug === state.cruiseShip?.slug,
    );
    if (!match) {
      startTransition(() => {
        setState((prev) => ({
          ...prev,
          cruiseShip: null,
          step:
            prev.step === "payment" || prev.step === "guests"
              ? "ship"
              : prev.step,
          returnToPayment:
            prev.step === "payment" || prev.returnToPayment
              ? true
              : prev.returnToPayment,
        }));
      });
      return;
    }
    if (
      match.arrivalTime !== state.cruiseShip.arrivalTime ||
      match.departureTime !== state.cruiseShip.departureTime ||
      match.timesVerified !== state.cruiseShip.timesVerified ||
      match.image?.src !== state.cruiseShip.image?.src ||
      match.image?.imagePosition !== state.cruiseShip.image?.imagePosition
    ) {
      startTransition(() => {
        setState((prev) => ({ ...prev, cruiseShip: match }));
      });
    }
  }, [state.date, state.cruiseShip, shipsForSelectedDate]);

  const go = (step: BookingStepId) =>
    setState((prev) => ({ ...prev, step }));

  const beginEdit = (step: BookingStepId) => {
    setState((prev) => ({
      ...prev,
      step,
      returnToPayment: prev.step === "payment" || prev.returnToPayment,
    }));
  };

  const canNavigateToStep = (step: BookingStepId): boolean => {
    if (step === "date") return true;
    if (step === "ship") return Boolean(state.date);
    if (step === "guests") return Boolean(state.date && state.cruiseShip);
    if (step === "payment") {
      if (
        !state.date ||
        !state.cruiseShip ||
        state.guests < bookingCapacityConfig.minGuests ||
        state.guests > bookingCheckoutGuestLimit
      ) {
        return false;
      }
      // Don’t skip the guests step on a first-time forward path.
      return (
        state.step === "guests" ||
        state.step === "payment" ||
        state.returnToPayment
      );
    }
    return false;
  };

  const handleProgressNavigate = (step: BookingStepId) => {
    if (!canNavigateToStep(step) || step === state.step) return;
    beginEdit(step);
  };

  const reset = () => {
    setState({
      ...initialState,
      bookingSessionId: createBookingSessionId(),
    });
    setHeroExiting(false);
    setLiveMessage("");
    setResumeOpen(false);
    setCheckoutCancelled(false);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const beginDateSelection = () => {
    if (heroExiting || resumeOpen) return;
    setHeroExiting(true);
    const delay = prefersReducedMotion() ? 0 : HERO_EXIT_MS;
    heroExitTimer.current = window.setTimeout(() => {
      setState((prev) => ({ ...prev, step: "date" }));
      setHeroExiting(false);
    }, delay);
  };

  const handleDateConfirmed = (isoDate: string) => {
    const label = formatBookingDate(isoDate);
    const ships = shipsByDate[isoDate] ?? [];

    trackBookingEvent("date_selected", {
      excursionId: bookingPrototypeTour.id,
      sailingDate: isoDate,
    });

    setState((prev) => {
      let nextShip = resolveShipForDate(prev.cruiseShip, ships);
      if (!nextShip && ships.length === 1) {
        nextShip = ships[0];
      }

      const returnToPayment = prev.returnToPayment;
      const nextStep: BookingStepId =
        returnToPayment && nextShip ? "payment" : "ship";
      const clearReturn = nextStep === "payment";

      return {
        ...prev,
        date: isoDate,
        cruiseShip: nextShip,
        step: nextStep,
        returnToPayment: clearReturn ? false : returnToPayment,
      };
    });

    const previousShip = state.cruiseShip;
    const nextShip =
      resolveShipForDate(previousShip, ships) ??
      (ships.length === 1 ? ships[0] : null);
    const returning =
      state.returnToPayment && Boolean(nextShip);

    setLiveMessage(
      returning && nextShip
        ? `${label} selected. ${nextShip.name} still visits Villefranche. Returning to booking.`
        : nextShip
          ? `${label} selected. ${nextShip.name} is visiting Villefranche. Continuing to confirm your ship.`
          : `${label} selected. Continuing to cruise ship selection.`,
    );
  };

  const handleSelectShip = (ship: BookingShipVisit) => {
    trackBookingEvent("ship_selected", {
      excursionId: bookingPrototypeTour.id,
      shipId: ship.slug,
      sailingDate: state.date ?? undefined,
    });
    setState((prev) => ({ ...prev, cruiseShip: ship }));
  };

  const handleShipContinue = () => {
    if (!state.cruiseShip) return;
    if (
      isCustomBookingShip(state.cruiseShip) &&
      !state.cruiseShip.name.trim()
    ) {
      return;
    }
    setState((prev) => {
      if (prev.returnToPayment) {
        return { ...prev, step: "payment", returnToPayment: false };
      }
      return { ...prev, step: "guests" };
    });
  };

  const handleGuestsContinue = () => {
    trackBookingEvent("guest_count_selected", {
      excursionId: bookingPrototypeTour.id,
      shipId: state.cruiseShip?.slug,
      sailingDate: state.date ?? undefined,
      guestCount: state.guests,
    });
    setState((prev) => {
      if (!prev.cruiseShip) {
        return { ...prev, step: "ship" };
      }
      return {
        ...prev,
        step: "payment",
        returnToPayment: false,
      };
    });
  };

  const paymentReady = Boolean(
    state.date &&
      state.cruiseShip &&
      state.guests >= bookingCapacityConfig.minGuests &&
      state.guests <= bookingCheckoutGuestLimit,
  );

  const isExperience = state.step === "tour";
  const selectedDateLabel = state.date
    ? formatBookingDate(state.date)
    : null;

  if (!hydrated) {
    return (
      <div
        className="book-shell py-24 text-center text-[var(--book-muted)]"
        aria-live="polite"
      >
        Preparing your day…
      </div>
    );
  }

  return (
    <div
      className={
        isExperience
          ? "relative flex flex-1 flex-col"
          : "flex flex-1 flex-col"
      }
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <BookingCheckoutHeader mode={isExperience ? "scene" : "booking"} />

      {resumeOpen && state.date && state.cruiseShip ? (
        <BookingResumePanel
          open={resumeOpen}
          date={state.date}
          shipName={state.cruiseShip.name}
          guests={state.guests}
          onContinueToPayment={() => {
            setResumeOpen(false);
            setState((prev) => ({
              ...prev,
              step: "payment",
              returnToPayment: false,
            }));
          }}
          onReview={() => {
            setResumeOpen(false);
            setState((prev) => ({
              ...prev,
              step: "date",
              returnToPayment: true,
            }));
          }}
          onStartAgain={reset}
        />
      ) : null}

      {isExperience ? (
        <TourIntroStep
          onContinue={beginDateSelection}
          isExiting={heroExiting || resumeOpen}
        />
      ) : (
        <div className="book-shell py-8 sm:py-12 lg:py-14">
          {state.step !== "tour" ? (
            <div className="mb-8 sm:mb-10">
              <BookingProgress
                current={state.step}
                canNavigateTo={canNavigateToStep}
                onNavigate={handleProgressNavigate}
              />
            </div>
          ) : null}

          <div
            key={state.step}
            className={
              state.step === "ship" ||
              state.step === "guests" ||
              state.step === "payment"
                ? DATE_TO_GUESTS_ENTER
                : "book-step-enter"
            }
          >
            {state.step === "date" ? (
              <DateStep
                selectedDate={state.date}
                onDateConfirmed={handleDateConfirmed}
                onBack={() => {
                  if (state.returnToPayment && state.cruiseShip) {
                    setState((prev) => ({
                      ...prev,
                      step: "payment",
                      returnToPayment: false,
                    }));
                    return;
                  }
                  go("tour");
                }}
              />
            ) : null}

            {state.step === "ship" && state.date ? (
              <ShipStep
                date={state.date}
                ships={shipsForSelectedDate}
                selectedShip={state.cruiseShip}
                onSelectShip={handleSelectShip}
                onContinue={handleShipContinue}
                continueLabel={
                  state.returnToPayment
                    ? "Continue to booking"
                    : "Continue to Guests"
                }
                onBack={() => {
                  if (state.returnToPayment && state.cruiseShip) {
                    setState((prev) => ({
                      ...prev,
                      step: "payment",
                      returnToPayment: false,
                    }));
                    return;
                  }
                  setState((prev) => ({
                    ...prev,
                    step: "date",
                    cruiseShip: null,
                  }));
                }}
              />
            ) : null}

            {state.step === "guests" ? (
              <GuestsStep
                guests={state.guests}
                selectedDateLabel={selectedDateLabel}
                cruiseShipName={state.cruiseShip?.name}
                cruiseShipTimingLine={
                  state.cruiseShip
                    ? formatVerifiedShipTimingLine(state.cruiseShip)
                    : null
                }
                onChangeGuests={(guests) =>
                  setState((prev) => ({
                    ...prev,
                    guests: clampGuests(guests),
                  }))
                }
                onContinue={handleGuestsContinue}
                continueLabel={
                  state.returnToPayment
                    ? "Continue to booking"
                    : "Continue to secure payment"
                }
                onBack={() => {
                  if (state.returnToPayment) {
                    setState((prev) => ({
                      ...prev,
                      step: "payment",
                      returnToPayment: false,
                    }));
                    return;
                  }
                  go("ship");
                }}
              />
            ) : null}

            {state.step === "payment" &&
            state.date &&
            state.cruiseShip ? (
              <PaymentStep
                date={state.date}
                guests={state.guests}
                cruiseShip={state.cruiseShip}
                bookingSessionId={state.bookingSessionId}
                checkoutCancelled={checkoutCancelled}
                onBack={() => go("guests")}
                onChangeDate={() => beginEdit("date")}
                onChangeShip={() => beginEdit("ship")}
                onChangeGuests={() => beginEdit("guests")}
                canPay={paymentReady}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
