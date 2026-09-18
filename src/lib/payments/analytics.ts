/**
 * Anonymous booking-funnel analytics stubs.
 * Wire to a real analytics backend later — keep properties non-sensitive.
 */

export type BookingAnalyticsEvent =
  | "booking_started"
  | "date_selected"
  | "ship_selected"
  | "guest_count_selected"
  | "checkout_started"
  | "checkout_cancelled"
  | "payment_succeeded"
  | "payment_failed"
  | "booking_confirmed";

export type BookingAnalyticsProps = {
  deviceCategory?: "mobile" | "tablet" | "desktop" | "unknown";
  excursionId?: string;
  shipId?: string;
  sailingDate?: string;
  guestCount?: number;
  bookingValue?: number;
  currency?: string;
  trafficSource?: string;
  bookingReference?: string;
  paymentMethodBrand?: string;
};

function inferDeviceCategory(): BookingAnalyticsProps["deviceCategory"] {
  if (typeof window === "undefined") return "unknown";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/** No-op emitter — replace body when analytics is connected. */
export function trackBookingEvent(
  event: BookingAnalyticsEvent,
  props: BookingAnalyticsProps = {},
): void {
  if (typeof window === "undefined") return;
  const payload = {
    event,
    ...props,
    deviceCategory: props.deviceCategory ?? inferDeviceCategory(),
    currency: props.currency ?? "EUR",
  };
  if (process.env.NODE_ENV === "development") {
    console.debug("[booking-analytics]", payload);
  }
  // Future: window.gtag / plausible / custom collector
  void payload;
}
