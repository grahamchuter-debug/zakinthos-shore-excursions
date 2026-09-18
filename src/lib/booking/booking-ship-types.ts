import type { CruiseScheduleEntry } from "@/lib/cruise-schedule-types";
import {
  getBookingShipImage,
  type BookingShipImage,
} from "@/lib/booking/booking-ship-imagery";
import { findVerifiedShipTiming } from "@/lib/booking/booking-verified-ship-timings";
import { slugifyShipName } from "@/lib/cruise-ship-utils";

/** Stable slug for the “My ship isn’t listed” prototype option. */
export const BOOKING_CUSTOM_SHIP_SLUG = "not-listed";

/**
 * Ship visiting Villefranche on a bookable date — stored with the booking.
 * Arrival/departure are independently optional and only set when present in
 * the verified central schedule (or an explicit override).
 */
export type BookingShipVisit = {
  name: string;
  slug: string;
  cruiseLine: string;
  /** Verified arrival only — null when unknown */
  arrivalTime: string | null;
  /** Verified departure only — null when unknown */
  departureTime: string | null;
  /** True when at least one verified clock time is available */
  timesVerified: boolean;
  /** Present when optional ship photography exists for this exact vessel */
  image?: BookingShipImage;
  /** Guest-entered ship when the published list didn’t include theirs */
  isCustom?: boolean;
};

export function createCustomBookingShipVisit(name: string): BookingShipVisit {
  return {
    name: name.trim(),
    slug: BOOKING_CUSTOM_SHIP_SLUG,
    cruiseLine: "Not listed",
    arrivalTime: null,
    departureTime: null,
    timesVerified: false,
    isCustom: true,
  };
}

export function isCustomBookingShip(
  ship: Pick<BookingShipVisit, "isCustom" | "slug"> | null | undefined,
): boolean {
  return Boolean(ship?.isCustom) || ship?.slug === BOOKING_CUSTOM_SHIP_SLUG;
}

export type BookingShipsByDate = Record<string, BookingShipVisit[]>;

/**
 * Format a verified port time for display.
 * Returns null for missing, placeholder, or unverified values.
 */
export function formatVerifiedShipTime(
  value: string | null | undefined,
): string | null {
  if (value == null) return null;
  const normalized = value.trim().toLowerCase();
  if (
    !normalized ||
    normalized === "tbc" ||
    normalized === "tb" ||
    normalized === "00:00" ||
    normalized === "0:00" ||
    normalized === "arrival" ||
    normalized === "departure"
  ) {
    return null;
  }
  return value.trim();
}

/** Build Arrives / Departs line only from verified times. */
export function formatVerifiedShipTimingLine(
  ship: Pick<
    BookingShipVisit,
    "arrivalTime" | "departureTime" | "timesVerified"
  >,
): string | null {
  if (!ship.timesVerified) return null;
  const arrival = formatVerifiedShipTime(ship.arrivalTime);
  const departure = formatVerifiedShipTime(ship.departureTime);
  const parts = [
    arrival ? `Arrives ${arrival}` : null,
    departure ? `Departs ${departure}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

function completeness(entry: CruiseScheduleEntry): number {
  return (
    (formatVerifiedShipTime(entry.arrival) ? 1 : 0) +
    (formatVerifiedShipTime(entry.departure) ? 1 : 0)
  );
}

/**
 * When the same ship appears more than once on a date, pick one row for
 * booking without inventing times. Prefer the more complete row; hard
 * conflicts remain listed in the data-quality audit.
 */
export function selectScheduleEntryForBooking(
  candidates: readonly CruiseScheduleEntry[],
): CruiseScheduleEntry {
  if (candidates.length === 0) {
    throw new Error(
      "selectScheduleEntryForBooking requires at least one entry",
    );
  }
  if (candidates.length === 1) return candidates[0]!;
  return [...candidates].sort((a, b) => completeness(b) - completeness(a))[0]!;
}

export function toBookingShipVisit(
  entry: CruiseScheduleEntry,
): BookingShipVisit {
  const slug = slugifyShipName(entry.ship);
  const image = getBookingShipImage(slug);
  const override = findVerifiedShipTiming(entry.date, slug);

  const arrivalTime = formatVerifiedShipTime(
    override?.arrivalTime ?? entry.arrival,
  );
  const departureTime = formatVerifiedShipTime(
    override?.departureTime ?? entry.departure,
  );
  const timesVerified =
    Boolean(override?.verified) || Boolean(arrivalTime || departureTime);

  return {
    name: entry.ship,
    slug,
    cruiseLine: entry.cruiseLine,
    arrivalTime,
    departureTime,
    timesVerified,
    ...(image ? { image } : {}),
  };
}
