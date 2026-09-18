export type BookingStatus =
  | "draft"
  | "awaiting_payment"
  | "paid"
  | "confirmed"
  | "payment_failed"
  | "cancelled"
  | "partially_refunded"
  | "refunded";

export type PaymentsEnv = {
  DB: D1Database;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  /** @deprecated Catalogue is authoritative; kept as single-product fallback */
  BOOKING_PRICE_PER_GUEST_EUR?: string;
  /** Optional multi-currency fallback major-unit price */
  BOOKING_PRICE_PER_GUEST?: string;
  CHECKOUT_CURRENCY?: string;
  ORIGINATING_SITE?: string;
  ORIGINATING_PORT?: string;
  /**
   * Trusted public site origin for Checkout success/cancel redirects
   * (e.g. https://villefrancheshoreexcursions.com or http://localhost:3000).
   * Preferred over SITE_ORIGIN when both are set.
   */
  SITE_BASE_URL?: string;
  SITE_ORIGIN?: string;
  CORS_ALLOWED_ORIGINS?: string;
  /** Resend API key — Worker secret only. */
  RESEND_API_KEY?: string;
  /** Ops inbox for paid-booking alerts (plain var). */
  INTERNAL_BOOKING_EMAIL?: string;
  /** Verified sender address, e.g. bookings@notifications.wowatour.com */
  EMAIL_FROM?: string;
  /** Display name for From header (brand-specific). */
  EMAIL_FROM_NAME?: string;
  /** Booking reference prefix, e.g. SV → SV-XXXXXXXX */
  BOOKING_REF_PREFIX?: string;
};

export type CreateCheckoutBody = {
  excursionId: string;
  /** Display hint only — Worker overwrites from catalogue. */
  excursionName?: string;
  excursionDate: string;
  shipId?: string | null;
  /** Required for custom / not-listed ships; overwritten for scheduled ships. */
  shipName?: string;
  adults?: number;
  children?: number;
  totalGuests: number;
  customerEmail: string;
  customerName: string;
  bookingSessionId?: string | null;
  /**
   * Ignored in v1 — cancellation protection is disabled until server-priced.
   * @deprecated
   */
  cancellationProtection?: boolean;
  /** Browser-reported total — ignored for charging; logged only if mismatch. */
  clientDisplayedTotalEur?: number;
  /**
   * Ignored — redirects are built from SITE_BASE_URL + catalogue paths only.
   * @deprecated
   */
  successUrl?: string;
  /**
   * Ignored — redirects are built from SITE_BASE_URL + catalogue paths only.
   * @deprecated
   */
  cancelUrl?: string;
};

export type BookingRow = {
  id: string;
  booking_reference: string;
  status: BookingStatus;
  excursion_id: string;
  excursion_name: string;
  excursion_date: string;
  ship_id: string | null;
  ship_name: string;
  adults: number;
  children: number;
  total_guests: number;
  currency: string;
  amount_total_cents: number;
  unit_amount_cents: number;
  cancellation_protection: number;
  originating_site: string;
  originating_port: string | null;
  booking_session_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  idempotency_key: string;
  email_confirmation_sent_at: string | null;
  email_supplier_sent_at: string | null;
  email_internal_sent_at?: string | null;
  created_at: string;
  updated_at: string;
};
