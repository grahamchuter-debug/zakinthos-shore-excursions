import type { PaymentsEnv } from "./types";
import { getExcursionProduct, type CatalogueCurrency } from "./catalogue";

/** Minimum / maximum guests for this excursion product (v1 single vehicle). */
export const MIN_GUESTS = 1;
export const MAX_GUESTS = 6;

/**
 * Server-trusted retail price in major units from the product catalogue.
 * No FX conversion — catalogue amounts are the selling-market face prices.
 */
export function getPricePerGuest(
  env: PaymentsEnv,
  excursionId?: string,
): number {
  if (excursionId) {
    const product = getExcursionProduct(excursionId);
    if (product?.pricePerGuest) return product.pricePerGuest;
    if (product?.pricePerGuestEur) return product.pricePerGuestEur;
  }

  const raw =
    env.BOOKING_PRICE_PER_GUEST_EUR?.trim() ||
    env.BOOKING_PRICE_PER_GUEST?.trim();
  if (!raw) {
    throw new Error(
      "Catalogue price or BOOKING_PRICE_PER_GUEST(_EUR) is required",
    );
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Booking price per guest must be a positive number");
  }
  return value;
}

/** @deprecated Prefer getPricePerGuest */
export function getPricePerGuestEur(
  env: PaymentsEnv,
  excursionId?: string,
): number {
  return getPricePerGuest(env, excursionId);
}

/** Convert major currency units to integer minor units (Stripe). */
export function majorToMinorUnits(major: number): number {
  return Math.round(major * 100);
}

/** @deprecated Prefer majorToMinorUnits */
export function eurToCents(eur: number): number {
  return majorToMinorUnits(eur);
}

export function calculateAmountCents(
  guests: number,
  pricePerGuest: number,
): { unitAmountCents: number; amountTotalCents: number } {
  const unitAmountCents = majorToMinorUnits(pricePerGuest);
  return {
    unitAmountCents,
    amountTotalCents: unitAmountCents * guests,
  };
}

export function getCurrencyForExcursion(
  env: PaymentsEnv,
  excursionId?: string,
): CatalogueCurrency {
  if (excursionId) {
    const product = getExcursionProduct(excursionId);
    if (product?.currency) return product.currency;
  }
  return (env.CHECKOUT_CURRENCY ?? "eur").toLowerCase() as CatalogueCurrency;
}

export function getCurrency(env: PaymentsEnv): string {
  return (env.CHECKOUT_CURRENCY ?? "eur").toLowerCase();
}
