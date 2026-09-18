/**
 * Compact booking reference + Checkout idempotency material.
 * Prefix comes from Worker env BOOKING_REF_PREFIX (e.g. SV, VF, LP).
 */

export function createBookingReference(prefix = "XX"): string {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  const stamp = Array.from(bytes, (b) => b.toString(36).toUpperCase())
    .join("")
    .slice(0, 8);
  const clean = prefix.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 4) || "XX";
  return `${clean}-${stamp}`;
}

/** Deterministic key for Stripe Checkout Session create idempotency. */
export function createIdempotencyKeySync(parts: {
  excursionId: string;
  excursionDate: string;
  shipId: string;
  totalGuests: number;
  customerEmail: string;
  bookingSessionId: string;
  attemptSalt?: string;
}): string {
  const material = [
    parts.excursionId,
    parts.excursionDate,
    parts.shipId,
    String(parts.totalGuests),
    parts.customerEmail.toLowerCase(),
    parts.bookingSessionId || "no-session",
    parts.attemptSalt ?? "",
  ].join("|");
  let h = 2166136261;
  for (let i = 0; i < material.length; i += 1) {
    h ^= material.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `checkout:${(h >>> 0).toString(16)}${material.length.toString(16)}`;
}
