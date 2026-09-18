/**
 * Bookable shore excursions — customer display + Worker catalogue alignment.
 *
 * Launch products are editorial-only until live EUR selling prices and
 * operational fulfilment routes are verified. Do not add priceAmount values
 * or bookable catalogue entries until those checks pass.
 */

import type { DestinationCurrencyCode } from "@/lib/commerce/currency";
import { SITE_CURRENCY } from "@/lib/commerce/currency";

export type BookableProduct = {
  id: string;
  slug: string;
  name: string;
  experienceName: string;
  shortName: string;
  experienceTitleLines: readonly string[];
  experienceSubheading: string;
  durationLabel: string;
  /** @deprecated Prefer priceAmount */
  priceEur: number;
  priceAmount: number;
  priceCurrency: DestinationCurrencyCode;
  path: string;
  bookingPath: string;
  successPath: string;
  imageAlt: string;
  backLabel: string;
  ctaLabel: string;
  checkoutReconnectLine: string;
  heroSlides: readonly {
    id: string;
    width: number;
    height: number;
    priority?: boolean;
  }[];
  checkoutReconnectImageId: string;
  checkoutReconnectImageAlt: string;
};

function hero(
  id: string,
  dims: { width: number; height: number },
  priority = false,
) {
  return { id, ...dims, priority };
}

function product(
  partial: Omit<BookableProduct, "priceAmount" | "priceCurrency" | "priceEur"> & {
    priceAmount: number;
  },
): BookableProduct {
  return {
    ...partial,
    priceEur: partial.priceAmount,
    priceCurrency: SITE_CURRENCY,
  };
}

/** Empty until EUR prices + fulfilment are verified. Helpers retained for future entries. */
export const BOOKABLE_PRODUCTS: readonly BookableProduct[] = [];

void hero;
void product;
void SITE_CURRENCY;

export function getBookableProduct(id: string): BookableProduct | undefined {
  return BOOKABLE_PRODUCTS.find((p) => p.id === id || p.slug === id);
}

export function getAllBookableProductSlugs(): string[] {
  return BOOKABLE_PRODUCTS.map((p) => p.slug);
}

/** Alias used by booking routes */
export function getAllBookableSlugs(): string[] {
  return getAllBookableProductSlugs();
}
