"use client";

import { useEffect, useRef } from "react";

import { BookingHeroMedia } from "@/components/booking-engine/booking-hero-media";
import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import { useBookingTour } from "@/components/booking-engine/booking-tour-context";

type TourIntroStepProps = {
  onContinue: () => void;
  isExiting?: boolean;
};

export function TourIntroStep({
  onContinue,
  isExiting = false,
}: TourIntroStepProps) {
  const bookingPrototypeTour = useBookingTour();
  const tour = bookingPrototypeTour;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isExiting) buttonRef.current?.focus({ preventScroll: true });
  }, [isExiting]);

  return (
    <section
      className={[
        "book-opening relative flex min-h-[100dvh] flex-col",
        isExiting ? "book-hero-exiting" : "",
      ].join(" ")}
      aria-hidden={isExiting || undefined}
    >
      <div className="book-hero-panel relative flex min-h-[100dvh] flex-1 flex-col justify-end overflow-hidden">
        <BookingHeroMedia
          slides={tour.heroGallery}
          paused={isExiting}
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--book-ink)]/72 via-[var(--book-ink)]/22 to-[var(--book-ink)]/08"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--book-ink)]/28 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="book-hero-copy relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 pt-36 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24">
          <h1 className="book-display max-w-3xl text-[3.1rem] font-medium leading-[0.96] text-white sm:text-6xl md:text-7xl lg:text-[5rem]">
            <span className="sr-only">{tour.name}</span>
            {tour.experienceTitleLines.map((line) => (
              <span key={line} className="block" aria-hidden="true">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-white/90 sm:mt-8 sm:text-xl sm:leading-8">
            {tour.experienceSubheading}
          </p>

          <div className="book-opening-cta mt-10 w-full max-w-sm sm:mt-12">
            <BookingPrimaryButton
              ref={buttonRef}
              variant="onDark"
              onClick={onContinue}
              disabled={isExiting}
            >
              {tour.ctaLabel}
            </BookingPrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
