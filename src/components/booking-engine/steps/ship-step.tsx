"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

import {
  BookingBackLink,
  BookingPrimaryButton,
} from "@/components/booking-engine/booking-primary-button";
import { bookingContactPath } from "@/lib/booking/booking-config";
import { formatBookingDate } from "@/lib/booking/booking-format";
import {
  createCustomBookingShipVisit,
  formatVerifiedShipTimingLine,
  isCustomBookingShip,
  type BookingShipVisit,
} from "@/lib/booking/booking-ship-types";

type ShipStepProps = {
  date: string;
  ships: readonly BookingShipVisit[];
  selectedShip: BookingShipVisit | null;
  onSelectShip: (ship: BookingShipVisit) => void;
  onContinue: () => void;
  onBack: () => void;
  continueLabel?: string;
};

const PERSONALISATION_LINE =
  "We'll tailor your meeting instructions to your cruise ship.";

function ShipCardButton({
  ship,
  selected,
  onSelect,
}: {
  ship: BookingShipVisit;
  selected: boolean;
  onSelect: () => void;
}) {
  const timing = formatVerifiedShipTimingLine(ship);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        "book-btn flex w-full flex-col items-start rounded-[1.25rem] border px-5 py-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)] sm:px-6",
        selected
          ? "border-[var(--book-sea-deep)] bg-[var(--book-sea-deep)] text-white shadow-[0_16px_40px_-28px_rgba(13,47,60,0.55)]"
          : "border-[var(--book-line)] bg-[var(--book-surface)] text-[var(--book-ink)] hover:border-[var(--book-ink)]/20",
      ].join(" ")}
    >
      <span className="text-lg font-semibold tracking-wide">{ship.name}</span>
      <span
        className={[
          "mt-1 text-sm",
          selected ? "text-white/75" : "text-[var(--book-muted)]",
        ].join(" ")}
      >
        {ship.cruiseLine}
      </span>
      {timing ? (
        <span
          className={[
            "mt-2 text-sm",
            selected ? "text-white/80" : "text-[var(--book-muted)]",
          ].join(" ")}
        >
          {timing}
        </span>
      ) : null}
      {selected ? (
        <span className="mt-4 text-[11px] font-medium tracking-[0.14em] text-white/80 uppercase">
          Selected for your cruise day ✓
        </span>
      ) : null}
    </button>
  );
}

function ShipFallbackFeatureButton({
  ship,
  onSelect,
}: {
  ship: BookingShipVisit;
  onSelect: () => void;
}) {
  const timing = formatVerifiedShipTimingLine(ship);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed="true"
      aria-label={`${ship.name}, ${ship.cruiseLine}, selected for your cruise day`}
      className="book-ship-fallback group relative w-full overflow-hidden rounded-[1.5rem] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
    >
      <div className="book-ship-fallback-surface relative min-h-[14rem] sm:min-h-[17rem]">
        <div className="book-ship-fallback-texture" aria-hidden="true" />
        <div className="relative z-10 flex min-h-[14rem] flex-col justify-end px-6 py-7 sm:min-h-[17rem] sm:px-8 sm:py-8">
          <p className="text-[11px] font-medium tracking-[0.18em] text-white/70 uppercase">
            Your cruise
          </p>
          <p className="book-display mt-2 text-3xl font-medium leading-[1.15] text-white sm:text-4xl">
            {ship.name}
          </p>
          <p className="mt-2 text-[15px] font-medium text-white/85">
            {ship.cruiseLine}
          </p>
          {timing ? (
            <p className="mt-3 text-sm text-white/75">{timing}</p>
          ) : null}
          <p
            className={[
              "text-[12px] font-medium tracking-[0.12em] text-white/90 uppercase",
              timing ? "mt-5" : "mt-6",
            ].join(" ")}
          >
            Selected for your cruise day ✓
          </p>
        </div>
      </div>
    </button>
  );
}

function ShipFeatureButton({
  ship,
  onSelect,
}: {
  ship: BookingShipVisit;
  onSelect: () => void;
}) {
  const image = ship.image;
  const timing = formatVerifiedShipTimingLine(ship);
  if (!image) return null;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed="true"
      aria-label={`${ship.name}, ${ship.cruiseLine}, selected for your cruise day`}
      className="book-ship-feature group relative w-full overflow-hidden rounded-[1.5rem] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
    >
      <div className="relative min-h-[14rem] sm:min-h-[17rem]">
        <picture>
          {image.avifSrcSet ? (
            <source
              type="image/avif"
              srcSet={image.avifSrcSet}
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          ) : null}
          <source
            type="image/webp"
            srcSet={image.srcSet}
            sizes="(max-width: 768px) 100vw, 42rem"
          />
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="book-ship-feature-image absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: image.imagePosition ?? "center",
            }}
            decoding="async"
          />
        </picture>
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--book-ink)]/90 via-[var(--book-ink)]/50 to-[var(--book-ink)]/10"
          aria-hidden="true"
        />
        <div className="relative z-10 flex min-h-[14rem] flex-col justify-end px-6 py-7 sm:min-h-[17rem] sm:px-8 sm:py-8">
          <p className="text-[11px] font-medium tracking-[0.18em] text-white/75 uppercase">
            Your cruise
          </p>
          <p className="book-display mt-2 text-3xl font-medium leading-[1.15] text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)] sm:text-4xl">
            {ship.name}
          </p>
          <p className="mt-2 text-[15px] font-medium text-white/90">
            {ship.cruiseLine}
          </p>
          {timing ? (
            <p className="mt-3 text-sm text-white/80">{timing}</p>
          ) : null}
          <p
            className={[
              "text-[12px] font-medium tracking-[0.12em] text-white/95 uppercase",
              timing ? "mt-5" : "mt-6",
            ].join(" ")}
          >
            Selected for your cruise day ✓
          </p>
        </div>
      </div>
    </button>
  );
}

function CustomShipOption({
  selected,
  customName,
  onSelect,
  onNameChange,
}: {
  selected: boolean;
  customName: string;
  onSelect: () => void;
  onNameChange: (name: string) => void;
}) {
  const fieldId = useId();

  return (
    <div
      className={[
        "rounded-[1.25rem] border transition",
        selected
          ? "border-[var(--book-sea-deep)]/40 bg-[var(--book-surface)]"
          : "border-transparent",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={[
          "book-btn flex w-full items-center justify-between gap-3 rounded-[1.25rem] px-5 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)] sm:px-6",
          selected
            ? "text-[var(--book-ink)]"
            : "text-[var(--book-muted)] hover:text-[var(--book-ink)]",
        ].join(" ")}
      >
        <span className="text-[15px] font-medium tracking-wide">
          My ship isn&apos;t listed
        </span>
        {selected ? (
          <span className="text-[11px] font-medium tracking-[0.12em] text-[var(--book-sea-deep)] uppercase">
            Selected
          </span>
        ) : null}
      </button>

      {selected ? (
        <div className="border-t border-[var(--book-line)]/70 px-5 pt-4 pb-5 sm:px-6">
          <label
            htmlFor={fieldId}
            className="mb-1.5 block text-sm text-[var(--book-muted)]"
          >
            Cruise ship name
          </label>
          <input
            id={fieldId}
            type="text"
            name="customCruiseShip"
            autoComplete="off"
            value={customName}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="e.g. Celestyal Discovery"
            className="w-full rounded-xl border border-[var(--book-line)] bg-white px-4 py-3.5 text-base text-[var(--book-ink)] outline-none transition focus:border-[var(--book-sea)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
          />
        </div>
      ) : null}
    </div>
  );
}

export function ShipStep({
  date,
  ships,
  selectedShip,
  onSelectShip,
  onContinue,
  onBack,
  continueLabel = "Continue to Guests",
}: ShipStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const singleShip = ships.length === 1;
  const multipleShips = ships.length > 1;
  const customSelected = isCustomBookingShip(selectedShip);
  const [customName, setCustomName] = useState(
    () => (customSelected ? selectedShip?.name ?? "" : ""),
  );
  const didAutoSelect = useRef(false);

  const canContinue = customSelected
    ? customName.trim().length > 0
    : Boolean(selectedShip);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    didAutoSelect.current = false;
  }, [date]);

  useEffect(() => {
    if (customSelected) {
      setCustomName(selectedShip?.name ?? "");
    }
  }, [customSelected, selectedShip?.name]);

  useEffect(() => {
    if (!singleShip || !ships[0] || didAutoSelect.current) return;
    if (selectedShip?.slug === ships[0].slug) {
      didAutoSelect.current = true;
      return;
    }
    didAutoSelect.current = true;
    onSelectShip(ships[0]);
  }, [singleShip, ships, selectedShip, onSelectShip]);

  const formattedDate = formatBookingDate(date);
  const showPersonalisation =
    Boolean(selectedShip) && (!customSelected || customName.trim().length > 0);

  const handleCustomSelect = () => {
    onSelectShip(createCustomBookingShipVisit(customName));
  };

  const handleCustomNameChange = (name: string) => {
    setCustomName(name);
    onSelectShip(createCustomBookingShipVisit(name));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-9">
      <BookingBackLink onClick={onBack} />

      <header className="space-y-3 text-center">
        <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--book-muted)] uppercase">
          {formattedDate}
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          id="booking-ship-heading"
          className="book-display text-4xl font-medium text-[var(--book-ink)] outline-none sm:text-5xl"
        >
          {singleShip ? "Your cruise ship" : "Which cruise ship?"}
        </h2>
        <p className="mx-auto max-w-md text-lg text-[var(--book-muted)]">
          {singleShip
            ? "We've matched the only ship visiting Villefranche on your selected date."
            : "Select the ship you'll be arriving on in Villefranche."}
        </p>
      </header>

      {ships.length === 0 ? (
        <div className="rounded-[1.75rem] bg-[var(--book-surface)] px-6 py-10 text-center shadow-[0_24px_60px_-36px_rgba(12,26,36,0.3)] sm:px-10">
          <p className="text-base leading-7 text-[var(--book-muted)]">
            No cruise ships are listed for this date in our published schedule
            yet. Please choose another date, or contact our cruise excursion
            team for help.
          </p>
          <p className="mt-5">
            <Link
              href={bookingContactPath}
              className="book-text-link underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--w2-focus-ring)]"
            >
              Contact us
            </Link>
          </p>
        </div>
      ) : (
        <fieldset className="space-y-3 border-0 p-0">
          <legend className="sr-only">Cruise ship</legend>
          {ships.map((ship) => {
            const selected =
              !customSelected && selectedShip?.slug === ship.slug;
            const showPhotoFeature = selected && Boolean(ship.image);
            const showFallbackFeature = selected && !ship.image;

            if (showPhotoFeature) {
              return (
                <div key={ship.slug} className="space-y-3">
                  <ShipFeatureButton
                    ship={ship}
                    onSelect={() => onSelectShip(ship)}
                  />
                  {showPersonalisation ? (
                    <p className="px-1 text-center text-sm text-[var(--book-muted)] sm:text-left">
                      {PERSONALISATION_LINE}
                    </p>
                  ) : null}
                </div>
              );
            }

            if (showFallbackFeature) {
              return (
                <div key={ship.slug} className="space-y-3">
                  <ShipFallbackFeatureButton
                    ship={ship}
                    onSelect={() => onSelectShip(ship)}
                  />
                  {showPersonalisation ? (
                    <p className="px-1 text-center text-sm text-[var(--book-muted)] sm:text-left">
                      {PERSONALISATION_LINE}
                    </p>
                  ) : null}
                </div>
              );
            }

            return (
              <div key={ship.slug} className="space-y-3">
                <ShipCardButton
                  ship={ship}
                  selected={selected}
                  onSelect={() => onSelectShip(ship)}
                />
                {selected && showPersonalisation ? (
                  <p className="px-1 text-center text-sm text-[var(--book-muted)] sm:text-left">
                    {PERSONALISATION_LINE}
                  </p>
                ) : null}
              </div>
            );
          })}

          {multipleShips ? (
            <div className="space-y-3 pt-2">
              <CustomShipOption
                selected={customSelected}
                customName={customName}
                onSelect={handleCustomSelect}
                onNameChange={handleCustomNameChange}
              />
              {customSelected && showPersonalisation ? (
                <p className="px-1 text-center text-sm text-[var(--book-muted)] sm:text-left">
                  {PERSONALISATION_LINE}
                </p>
              ) : null}
            </div>
          ) : null}
        </fieldset>
      )}

      {multipleShips && !selectedShip ? (
        <p className="text-center text-sm text-[var(--book-muted)]" role="status">
          Please select your cruise ship to continue.
        </p>
      ) : null}

      {multipleShips && customSelected && !customName.trim() ? (
        <p className="text-center text-sm text-[var(--book-muted)]" role="status">
          Enter your cruise ship name to continue.
        </p>
      ) : null}

      <div className="flex justify-center pt-2">
        <BookingPrimaryButton onClick={onContinue} disabled={!canContinue}>
          {continueLabel}
        </BookingPrimaryButton>
      </div>
    </div>
  );
}
