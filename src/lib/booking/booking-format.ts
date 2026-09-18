import { bookingPricingConfig } from "@/lib/booking/booking-config";

export function formatBookingMoney(amount: number): string {
  if (!bookingPricingConfig.priceConfigured && amount === 0) {
    return "Price on request";
  }
  const { currencyCode, currencySymbol } = bookingPricingConfig;
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currencySymbol}${amount}`;
  }
}

export function formatBookingDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function calculateBookingTotal(
  guests: number,
  pricePerGuest: number = bookingPricingConfig.pricePerGuest,
): number {
  if (!bookingPricingConfig.priceConfigured) return 0;
  return guests * pricePerGuest;
}

/** Local calendar YYYY-MM-DD (avoids UTC off-by-one). */
export function toLocalIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfLocalDay(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
