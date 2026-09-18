/**
 * Server-controlled excursion catalogue for Checkout.
 * Browser-supplied excursionName / price are never authoritative.
 *
 * Multi-currency: each product carries Stripe currency + major-unit price.
 * Never convert between currencies — use the selling-market face price.
 *
 * Zakynthos launch: empty until EUR face prices and fulfilment routes are verified.
 */

export type CatalogueCurrency = "eur" | "usd" | "gbp";

export type ExcursionProduct = {
  id: string;
  name: string;
  bookingPath: string;
  successPath: string;
  /** Authoritative major units per guest (same face price as source catalogue) */
  pricePerGuest: number;
  /** Stripe currency code */
  currency: CatalogueCurrency;
  /** @deprecated Prefer pricePerGuest — kept for transitional callers */
  pricePerGuestEur?: number;
};

export const EXCURSION_CATALOGUE: Readonly<Record<string, ExcursionProduct>> = {} as const;

export function getExcursionProduct(excursionId: string): ExcursionProduct | null {
  const id = excursionId.trim();
  return EXCURSION_CATALOGUE[id] ?? null;
}
