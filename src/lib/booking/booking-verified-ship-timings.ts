/**
 * Optional per-call overrides for booking.
 *
 * Bulk Villefranche times come from the CruiseTimetables import into
 * `public/data/*.csv`. Use this file only for hand-verified corrections.
 *
 * Never invent, estimate, or default times.
 */
export type VerifiedShipTiming = {
  date: string;
  shipSlug: string;
  arrivalTime: string | null;
  departureTime: string | null;
  verified: true;
};

/**
 * Hand-verified overrides only. Empty when the CSV import is authoritative.
 */
export const bookingVerifiedShipTimings: readonly VerifiedShipTiming[] = [];

export function findVerifiedShipTiming(
  date: string,
  shipSlug: string,
): VerifiedShipTiming | undefined {
  return bookingVerifiedShipTimings.find(
    (entry) => entry.date === date && entry.shipSlug === shipSlug && entry.verified,
  );
}
