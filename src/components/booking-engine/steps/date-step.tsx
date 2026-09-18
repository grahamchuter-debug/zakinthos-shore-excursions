"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BookingHeroMedia } from "@/components/booking-engine/booking-hero-media";
import { BookingBackLink } from "@/components/booking-engine/booking-primary-button";
import { useBookingTour } from "@/components/booking-engine/booking-tour-context";
import {
  formatBookingDate,
  startOfLocalDay,
  toLocalIsoDate,
} from "@/lib/booking/booking-format";

type DateStepProps = {
  selectedDate: string | null;
  onSelectDate?: (isoDate: string | null) => void;
  /** Called after polished confirmation pause — advances to guests */
  onDateConfirmed: (isoDate: string) => void;
  onBack: () => void;
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
const CONFIRM_DELAY_MS = 450;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (first.getDay() + 6) % 7;
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function DateStep({
  selectedDate,
  onSelectDate,
  onDateConfirmed,
  onBack,
}: DateStepProps) {
  const bookingPrototypeTour = useBookingTour();
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState<Date | null>(null);
  const [pendingDate, setPendingDate] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const desktopHeadingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    const start = startOfLocalDay();
    setToday(start);
    setView(new Date(start.getFullYear(), start.getMonth(), 1));
  }, []);

  useEffect(() => {
    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches;
    const target = isDesktop ? desktopHeadingRef.current : headingRef.current;
    target?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimer.current !== null) {
        window.clearTimeout(advanceTimer.current);
      }
    };
  }, []);

  const cells = useMemo(
    () => (view ? buildMonthGrid(view.getFullYear(), view.getMonth()) : []),
    [view],
  );

  const monthLabel = view
    ? new Intl.DateTimeFormat("en-GB", {
        month: "long",
        year: "numeric",
      }).format(view)
    : "";

  const canGoPrev =
    Boolean(today && view) &&
    (view!.getFullYear() > today!.getFullYear() ||
      (view!.getFullYear() === today!.getFullYear() &&
        view!.getMonth() > today!.getMonth()));

  const clearAdvanceTimer = () => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  };

  const handleSelectDate = (iso: string, date: Date) => {
    if (!today || date < today) return;

    clearAdvanceTimer();
    setPendingDate(iso);
    onSelectDate?.(iso);

    const label = formatBookingDate(iso);
    setAnnouncement(`${label} selected`);

    const delay = prefersReducedMotion() ? 0 : CONFIRM_DELAY_MS;
    advanceTimer.current = window.setTimeout(() => {
      onDateConfirmed(iso);
    }, delay);
  };

  const handleBack = () => {
    clearAdvanceTimer();
    setPendingDate(null);
    onBack();
  };

  if (!today || !view) {
    return (
      <div
        className="py-20 text-center text-[var(--book-muted)]"
        aria-live="polite"
      >
        Loading calendar…
      </div>
    );
  }

  const displayDate = pendingDate ?? selectedDate;

  return (
    <div className="book-date-stage mx-auto max-w-4xl">
      <BookingBackLink onClick={handleBack} className="mb-4 sm:mb-5 lg:mb-8" />

      <div className="lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12 xl:gap-16">
        {/* Intro — stacked on mobile; editorial left column on desktop */}
        <div>
          <div className="book-date-hero-remnant relative overflow-hidden rounded-[1.25rem]">
            <BookingHeroMedia slides={bookingPrototypeTour.heroGallery} />
            <div
              className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[var(--book-ink)]/78 via-[var(--book-ink)]/28 to-transparent lg:from-[var(--book-ink)]/35 lg:via-transparent lg:to-transparent"
              aria-hidden="true"
            />
            {/* Mobile / tablet: heading rides on the image */}
            <div className="absolute inset-x-0 bottom-0 z-[3] px-5 pb-5 pt-10 sm:px-8 sm:pb-7 sm:pt-12 lg:hidden">
              <p className="text-[11px] font-medium tracking-[0.18em] text-white/75 uppercase">
                Villefranche-sur-Mer
              </p>
              <h2
                ref={headingRef}
                tabIndex={-1}
                id="booking-date-heading"
                className="book-display mt-1.5 max-w-lg text-[1.65rem] font-medium leading-[1.08] text-white outline-none sm:mt-2 sm:text-4xl"
              >
                Choose your day ashore
              </h2>
            </div>
          </div>

          <p className="mt-4 max-w-md text-[15px] leading-6 text-[var(--book-muted)] sm:text-base lg:hidden">
            Select the day your cruise ship visits Villefranche-sur-Mer.
          </p>

          {/* Desktop: typography below a compact image */}
          <header className="mt-6 hidden space-y-3 lg:block">
            <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--book-muted)] uppercase">
              Villefranche-sur-Mer
            </p>
            <h2
              ref={desktopHeadingRef}
              tabIndex={-1}
              id="booking-date-heading-desktop"
              className="book-display text-4xl font-medium leading-[1.08] text-[var(--book-ink)] outline-none xl:text-[2.75rem]"
            >
              Choose your day ashore
            </h2>
            <p className="max-w-sm text-base leading-7 text-[var(--book-muted)]">
              Select the day your cruise ship visits Villefranche-sur-Mer.
            </p>
          </header>
        </div>

        <div
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        {/* Calendar — full width below on mobile; dominant right column on desktop */}
        <div className="mt-5 border-t border-[var(--book-line)] pt-5 sm:mt-6 sm:pt-6 lg:mt-0 lg:border-t-0 lg:border-l lg:border-[var(--book-line)] lg:pl-10 lg:pt-1 xl:pl-12">
          <div className="mx-auto max-w-md lg:mx-0 lg:max-w-none">
            <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
              <button
                type="button"
                onClick={() => {
                  clearAdvanceTimer();
                  setPendingDate(null);
                  setAnnouncement("");
                  onSelectDate?.(null);
                  setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
                }}
                disabled={!canGoPrev}
                className="book-btn rounded-full px-4 py-2 text-sm font-medium text-[var(--book-sea)] disabled:opacity-25"
                aria-label="Previous month"
              >
                ←
              </button>
              <p
                key={monthLabel}
                className="book-selected-date book-display text-2xl font-medium text-[var(--book-ink)]"
              >
                {monthLabel}
              </p>
              <button
                type="button"
                onClick={() => {
                  clearAdvanceTimer();
                  setPendingDate(null);
                  setAnnouncement("");
                  onSelectDate?.(null);
                  setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));
                }}
                className="book-btn rounded-full px-4 py-2 text-sm font-medium text-[var(--book-sea)]"
                aria-label="Next month"
              >
                →
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--book-muted)]">
              {WEEKDAYS.map((day) => (
                <span key={day} className="py-2">
                  {day}
                </span>
              ))}
            </div>

            <div
              key={`${view.getFullYear()}-${view.getMonth()}`}
              className="book-calendar-grid grid grid-cols-7 gap-1.5 sm:gap-2"
              role="grid"
              aria-label={`${monthLabel} — choose your day ashore`}
            >
              {cells.map((date, index) => {
                if (!date) {
                  return (
                    <span key={`empty-${index}`} className="aspect-square" />
                  );
                }
                const iso = toLocalIsoDate(date);
                const disabled = date < today;
                const selected = displayDate === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={disabled || Boolean(pendingDate)}
                    onClick={() => handleSelectDate(iso, date)}
                    aria-label={formatBookingDate(iso)}
                    aria-pressed={selected}
                    className={[
                      "book-day-btn aspect-square rounded-2xl text-base font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]",
                      disabled
                        ? "cursor-not-allowed text-[var(--book-line)]"
                        : selected
                          ? "bg-[var(--book-sea-deep)] text-white"
                          : "text-[var(--book-ink)] hover:bg-[var(--book-mist)]",
                      pendingDate && selected ? "book-day-confirming" : "",
                    ].join(" ")}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {displayDate ? (
              <p
                key={displayDate}
                className="book-selected-date mt-5 text-center text-base font-medium text-[var(--book-ink)] lg:text-left"
                aria-hidden="true"
              >
                {formatBookingDate(displayDate)} selected
              </p>
            ) : (
              <p className="mt-5 text-center text-sm text-[var(--book-muted)] lg:text-left">
                Select a date to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
