/**
 * Client helpers for the Cloudflare payments Worker.
 * Modular for reuse across shore-excursion sites.
 */

export type CreateCheckoutSessionRequest = {
  excursionId: string;
  /** Display hint only — Worker overwrites from its catalogue. */
  excursionName?: string;
  excursionDate: string;
  shipId?: string | null;
  /** Required for custom ships; overwritten for scheduled ships. */
  shipName?: string;
  adults?: number;
  children?: number;
  totalGuests: number;
  customerEmail: string;
  customerName: string;
  bookingSessionId?: string | null;
  /** Ignored in v1 — Worker does not price cancellation protection. */
  cancellationProtection?: boolean;
  clientDisplayedTotalEur?: number;
};

export type CreateCheckoutSessionResponse = {
  url: string;
  bookingReference: string;
  sessionId: string;
};

export type VerifyCheckoutSessionResponse = {
  sessionId: string;
  paymentStatus: string | null;
  sessionStatus: string | null;
  paid: boolean;
  /** True when D1 status is paid/confirmed (webhook finalised). */
  bookingFinalised: boolean;
  bookingReference: string | null;
  bookingStatus: string | null;
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
  customerName: string | null;
  customerPhone: string | null;
  metadata: Record<string, string>;
  excursionDate: string | null;
  shipName: string | null;
  totalGuests: number | null;
  excursionName: string | null;
};

export function getPaymentsApiBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_PAYMENTS_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export async function createCheckoutSession(
  body: CreateCheckoutSessionRequest,
): Promise<CreateCheckoutSessionResponse> {
  const base = getPaymentsApiBaseUrl();
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_PAYMENTS_API_URL is not configured. Set it to your payments Worker URL.",
    );
  }

  const response = await fetch(`${base}/api/checkout/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as {
    url?: string;
    bookingReference?: string;
    sessionId?: string;
    error?: string;
    details?: string[];
  };

  if (!response.ok || !data.url || !data.bookingReference) {
    const detail =
      data.error ??
      (Array.isArray(data.details) ? data.details.join(", ") : null) ??
      `Checkout failed (${response.status})`;
    throw new Error(detail);
  }

  return {
    url: data.url,
    bookingReference: data.bookingReference,
    sessionId: data.sessionId ?? "",
  };
}

export async function verifyCheckoutSession(
  sessionId: string,
): Promise<VerifyCheckoutSessionResponse> {
  const base = getPaymentsApiBaseUrl();
  if (!base) {
    throw new Error("NEXT_PUBLIC_PAYMENTS_API_URL is not configured");
  }

  const url = new URL(`${base}/api/checkout/session`);
  url.searchParams.set("session_id", sessionId);

  const response = await fetch(url.toString(), { method: "GET" });
  const data = (await response.json().catch(() => ({}))) as
    | VerifyCheckoutSessionResponse
    | { error?: string };

  if (!response.ok || !("paid" in data)) {
    throw new Error(
      ("error" in data && data.error) ||
        `Could not verify payment (${response.status})`,
    );
  }

  return {
    ...data,
    bookingFinalised: Boolean(data.bookingFinalised),
  };
}
