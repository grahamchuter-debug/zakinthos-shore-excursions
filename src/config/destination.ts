/**
 * World 2.0 Destination Configuration — Zakynthos Shore Excursions
 *
 * Domain is the single source of truth for canonicals, sitemap, OG, JSON-LD and Worker CORS.
 * Do not hard-code the hostname elsewhere.
 */

import type { DestinationCurrencyCode } from "@/lib/commerce/currency";

export type DestinationRegion =
  | "europe"
  | "caribbean"
  | "alaska"
  | "british-isles"
  | "other";

/**
 * CENTRAL — public contact is info@wowatour.com only (default until forwarding works).
 * LOCAL — display hello@ / bookings@ / privacy@ on the destination domain.
 */
export type ContactMode = "central" | "local";

export type DestinationConfig = {
  slug: string;
  name: string;
  destination: string;
  descriptor: string;
  strapline: string;
  domain: string;
  url: string;
  description: string;
  locale: string;
  region: DestinationRegion;
  currency: DestinationCurrencyCode;
  bookingRefPrefix: string;
  pagesProject: string;
  paymentsWorkerName: string;
  d1DatabaseName: string;
  /**
   * Public contact presentation. Keep `central` until destination email
   * forwarding (hello/bookings/privacy) is configured, then switch to `local`.
   */
  contactMode: ContactMode;
  /** Destination-local addresses — used only when contactMode is `local`. */
  contact: {
    hello: string;
    bookings: string;
    privacy: string;
  };
  legal: {
    tradingName: string;
    legalCompanyName: string;
    companyNumber: string;
    registeredJurisdiction: string;
    registeredOfficeLines: string[];
    registeredOfficeFormatted: string;
  };
  port: {
    scheduleSlug: string;
    meetingPointLabel: string;
    country: string;
  };
  seo: {
    defaultKeywords: string[];
  };
  nav: readonly { href: string; label: string }[];
  experienceCategories: readonly string[];
};

export const destinationConfig = {
  slug: "zakinthos",
  name: "Zakynthos Shore Excursions",
  destination: "Zakynthos",
  descriptor: "Shore Excursions",
  strapline: "The Emerald Jewel of the Ionian",
  domain: "zakinthosshoreexcursions.com",
  url: "https://zakinthosshoreexcursions.com",
  description:
    "Independent Zakynthos shore excursions and honest cruise-port guidance — Navagio viewpoints, Blue Caves, loggerhead turtles, Zakynthos Town harbour life and Ionian island days designed around your ship.",
  locale: "en_GB",
  region: "europe",
  currency: "EUR",
  bookingRefPrefix: "ZK",
  pagesProject: "zakinthos-shore-excursions",
  paymentsWorkerName: "zakinthos-payments",
  d1DatabaseName: "zakinthos-bookings",
  contactMode: "central",
  contact: {
    hello: "hello@zakinthosshoreexcursions.com",
    bookings: "bookings@zakinthosshoreexcursions.com",
    privacy: "privacy@zakinthosshoreexcursions.com",
  },
  legal: {
    tradingName: "Zakynthos Shore Excursions",
    legalCompanyName: "Wow A Tour Ltd",
    companyNumber: "11426960",
    registeredJurisdiction: "England and Wales",
    registeredOfficeLines: [
      "Kintyre House",
      "70 High Street",
      "Fareham",
      "Hampshire",
      "United Kingdom",
      "PO16 7BB",
    ],
    registeredOfficeFormatted:
      "Kintyre House, 70 High Street, Fareham, Hampshire, United Kingdom, PO16 7BB",
  },
  port: {
    scheduleSlug: "zakinthos",
    meetingPointLabel: "Zakynthos Cruise Port",
    country: "Greece",
  },
  seo: {
    defaultKeywords: [
      "Zakynthos shore excursions",
      "Zakinthos shore excursions",
      "Zakynthos cruise excursions",
      "Navagio Shipwreck Beach cruise",
      "Blue Caves Zakynthos",
      "Zakynthos Town walk",
      "Zante cruise port guide",
      "Caretta caretta Zakynthos",
    ],
  },
  nav: [
    { href: "/compare", label: "Compare" },
    { href: "/shore-excursions", label: "Excursions" },
    { href: "/guides", label: "Guides" },
    { href: "/wow-collection", label: "Wow Collection" },
    { href: "/cruise-planner", label: "Planner" },
    { href: "/cruise-port-guide", label: "Port Guide" },
  ],
  experienceCategories: [
    "Coastal Adventures",
    "Island Highlights",
    "Wildlife",
    "Food & Harbour Life",
    "Scenic Drives",
    "Small Groups",
    "Family Friendly",
    "Luxury",
  ],
} as const satisfies DestinationConfig;

export type AppDestinationConfig = typeof destinationConfig;
