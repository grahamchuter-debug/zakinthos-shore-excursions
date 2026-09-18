/**
 * World 2.0 booking status — configuration-driven product availability.
 *
 * Prefer `bookingStatus` on each excursion. Legacy `bookable: boolean` remains
 * supported and is mapped:
 *   bookable: true  → live
 *   bookable: false → enquiryOnly
 */

export type BookingStatus =
  | "comingSoon"
  | "enquiryOnly"
  | "live"
  | "soldOut"
  | "seasonal";

export type BookingCapable = {
  bookingStatus?: BookingStatus;
  /** @deprecated Prefer bookingStatus */
  bookable?: boolean;
  bookingPath?: string;
  priceAmount?: number;
  priceEur?: number;
};

export function resolveBookingStatus(product: BookingCapable): BookingStatus {
  if (product.bookingStatus) return product.bookingStatus;
  if (product.bookable === true) return "live";
  if (product.bookable === false) return "enquiryOnly";
  return "enquiryOnly";
}

/** Online Stripe checkout is only offered for live products with a booking path. */
export function isBookableOnline(product: BookingCapable): boolean {
  return resolveBookingStatus(product) === "live" && Boolean(product.bookingPath);
}

/** Show a customer-facing major-unit price only when live (or explicitly priced). */
export function shouldShowPublicPrice(product: BookingCapable): boolean {
  const status = resolveBookingStatus(product);
  if (status === "comingSoon") return false;
  if (product.priceAmount == null && product.priceEur == null) return false;
  return status === "live" || status === "seasonal" || status === "soldOut";
}

export function bookingStatusLabel(status: BookingStatus): string {
  switch (status) {
    case "comingSoon":
      return "Coming soon";
    case "enquiryOnly":
      return "Enquire to book";
    case "live":
      return "Book online";
    case "soldOut":
      return "Sold out";
    case "seasonal":
      return "Seasonal availability";
    default:
      return "Enquire to book";
  }
}

export function bookingPrimaryCta(product: BookingCapable): {
  href: string;
  label: string;
  kind: "book" | "enquire" | "none";
} {
  const status = resolveBookingStatus(product);
  if (status === "live" && product.bookingPath) {
    return { href: product.bookingPath, label: "Book Now", kind: "book" };
  }
  if (status === "soldOut") {
    return { href: "/enquire", label: "Join waitlist / enquire", kind: "enquire" };
  }
  if (status === "comingSoon") {
    return { href: "/enquire", label: "Enquire about availability", kind: "enquire" };
  }
  if (status === "seasonal") {
    return { href: "/enquire", label: "Enquire about dates", kind: "enquire" };
  }
  return { href: "/enquire", label: "Enquire about this excursion", kind: "enquire" };
}
