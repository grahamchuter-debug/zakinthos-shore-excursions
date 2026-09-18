/**
 * World 2.0 commerce currency helpers.
 *
 * Destination rule (no FX conversion of supplier list prices):
 * - Europe → EUR
 * - Caribbean → USD
 * - Alaska → USD
 * - British Isles → GBP
 *
 * Display the same customer-facing major-unit prices shown by the source
 * catalogue for that market — never convert between currencies.
 */

import { destinationConfig } from "@/config/destination";

export type DestinationCurrencyCode = "EUR" | "USD" | "GBP";

export type StripeCurrencyCode = "eur" | "usd" | "gbp";

export const DESTINATION_CURRENCY_DEFAULTS = {
  europe: "EUR",
  caribbean: "USD",
  alaska: "USD",
  "british-isles": "GBP",
} as const satisfies Record<string, DestinationCurrencyCode>;

/** Active destination currency from config (never FX-convert list prices). */
export const SITE_CURRENCY: DestinationCurrencyCode = destinationConfig.currency;

export const CURRENCY_SYMBOL: Record<DestinationCurrencyCode, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

export function toStripeCurrency(code: DestinationCurrencyCode): StripeCurrencyCode {
  return code.toLowerCase() as StripeCurrencyCode;
}

export function formatMajorMoney(
  amount: number,
  currency: DestinationCurrencyCode = SITE_CURRENCY,
  locale = "en-GB",
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${CURRENCY_SYMBOL[currency]}${amount}`;
  }
}

/** Stripe minor units (cents/pence) from major display units. */
export function majorToMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}
