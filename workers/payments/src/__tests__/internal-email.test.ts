import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  buildInternalBookingEmail,
  deliverInternalOutboxForBooking,
  enqueueInternalBookingNotification,
  formatEmailFrom,
  MANUAL_CUSTOMER_CONFIRMATION_BANNER,
  sendViaResend,
} from "../email";
import type { BookingRow, PaymentsEnv } from "../types";

function booking(overrides: Partial<BookingRow> = {}): BookingRow {
  return {
    id: "b1",
    booking_reference: "VF-TEST01",
    status: "confirmed",
    excursion_id: "monaco-monte-carlo-eze-small-group",
    excursion_name: "Monaco, Monte Carlo & Èze Small Group Shore Excursion",
    excursion_date: "2026-08-03",
    ship_id: "celebrity-equinox",
    ship_name: "Celebrity Equinox",
    adults: 2,
    children: 0,
    total_guests: 2,
    currency: "eur",
    amount_total_cents: 29800,
    unit_amount_cents: 14900,
    cancellation_protection: 0,
    originating_site: "villefrancheshoreexcursions.com",
    originating_port: "Villefranche",
    booking_session_id: "sess",
    customer_email: "guest@example.com",
    customer_name: "Test Guest",
    customer_phone: "+441111111111",
    stripe_checkout_session_id: "cs_test_123",
    stripe_payment_intent_id: "pi_test_123",
    idempotency_key: "key",
    email_confirmation_sent_at: null,
    email_supplier_sent_at: null,
    email_internal_sent_at: null,
    created_at: "2026-07-21T12:00:00.000Z",
    updated_at: "2026-07-21T12:00:00.000Z",
    ...overrides,
  };
}

function mockEnv(overrides: Partial<PaymentsEnv> = {}): PaymentsEnv {
  return {
    DB: {} as D1Database,
    STRIPE_SECRET_KEY: "sk_test_x",
    STRIPE_WEBHOOK_SECRET: "whsec_x",
    BOOKING_PRICE_PER_GUEST_EUR: "149",
    RESEND_API_KEY: "re_test",
    INTERNAL_BOOKING_EMAIL: "info@wowatour.com",
    EMAIL_FROM: "bookings@notifications.wowatour.com",
    EMAIL_FROM_NAME: "Villefranche Shore Excursions",
    ...overrides,
  };
}

describe("internal email content", () => {
  it("includes required booking details and ACTION REQUIRED banner", () => {
    const content = buildInternalBookingEmail(booking(), {
      arrival: "07:00",
      departure: "19:00",
    });
    expect(content.subject).toBe(
      "New paid Villefranche booking — VF-TEST01 — 2026-08-03",
    );
    expect(content.text).toContain(MANUAL_CUSTOMER_CONFIRMATION_BANNER);
    expect(content.html).toContain(MANUAL_CUSTOMER_CONFIRMATION_BANNER);
    expect(content.text).toContain("Booking Reference");
    expect(content.text).toContain("VF-TEST01");
    expect(content.text).toContain(
      "Open Booking: https://villefrancheshoreexcursions.com/admin/booking/VF-TEST01",
    );
    expect(content.html).toContain("Booking Reference");
    expect(content.html).toContain("Open Booking");
    expect(content.html).toContain(
      "https://villefrancheshoreexcursions.com/admin/booking/VF-TEST01",
    );
    expect(content.html).toContain('mailto:guest@example.com');
    expect(content.text).toContain("Celebrity Equinox");
    expect(content.text).toContain("07:00");
    expect(content.text).toContain("19:00");
    expect(content.text).toContain("EUR 298.00");
    expect(content.text).toContain("cs_test_123");
    expect(content.text).toContain("manually");
  });

  it("formats From name and address separately", () => {
    expect(formatEmailFrom(mockEnv())).toBe(
      "Villefranche Shore Excursions <bookings@notifications.wowatour.com>",
    );
  });
});

describe("outbox idempotency and delivery", () => {
  type OutboxRow = {
    id: string;
    booking_reference: string;
    kind: string;
    status: string;
    attempts: number;
    last_error: string | null;
    provider_message_id: string | null;
    payload_json: string;
  };

  let outbox: OutboxRow[];
  let bookings: Map<string, BookingRow>;
  let sendMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    outbox = [];
    bookings = new Map([["VF-TEST01", booking()]]);
    sendMock = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        const result = sendMock();
        if (result.ok) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ id: result.id }),
          };
        }
        return {
          ok: false,
          status: 500,
          json: async () => ({ message: result.error }),
        };
      }),
    );
  });

  function envWithDb(): PaymentsEnv {
    const env = mockEnv();
    env.DB = {
      prepare(sql: string) {
        return {
          bind(...args: unknown[]) {
            return {
              async run() {
                if (sql.includes("INSERT INTO email_outbox")) {
                  const existing = outbox.find(
                    (r) =>
                      r.booking_reference === args[1] && r.kind === args[2],
                  );
                  if (existing) throw new Error("UNIQUE");
                  outbox.push({
                    id: String(args[0]),
                    booking_reference: String(args[1]),
                    kind: String(args[2]),
                    status: "pending",
                    attempts: 0,
                    last_error: null,
                    provider_message_id: null,
                    payload_json: String(args[3]),
                  });
                  return { meta: { changes: 1 } };
                }
                if (sql.includes("SET status = 'processing'")) {
                  const id = String(args[2]);
                  const row = outbox.find((r) => r.id === id);
                  if (
                    row &&
                    (row.status === "pending" || row.status === "failed")
                  ) {
                    row.status = "processing";
                    row.attempts += 1;
                    return { meta: { changes: 1 } };
                  }
                  return { meta: { changes: 0 } };
                }
                if (sql.includes("SET status = 'sent'")) {
                  const id = String(args[3]);
                  const row = outbox.find((r) => r.id === id);
                  if (row && row.status === "processing") {
                    row.status = "sent";
                    row.provider_message_id = args[2]
                      ? String(args[2])
                      : row.provider_message_id;
                    return { meta: { changes: 1 } };
                  }
                  return { meta: { changes: 0 } };
                }
                if (sql.includes("SET status = 'failed'")) {
                  const id = String(args[3]);
                  const row = outbox.find((r) => r.id === id);
                  if (row) {
                    row.status = "failed";
                    row.last_error = String(args[0]);
                    return { meta: { changes: 1 } };
                  }
                  return { meta: { changes: 0 } };
                }
                if (sql.includes("email_internal_sent_at")) {
                  const ref = String(args[2]);
                  const b = bookings.get(ref);
                  if (b) b.email_internal_sent_at = String(args[0]);
                  return { meta: { changes: 1 } };
                }
                return { meta: { changes: 0 } };
              },
              async first() {
                if (sql.includes("FROM bookings")) {
                  return bookings.get(String(args[0])) ?? null;
                }
                return null;
              },
              async all() {
                if (sql.includes("FROM email_outbox")) {
                  const ref = args[0] != null ? String(args[0]) : null;
                  const rows = outbox.filter(
                    (r) =>
                      (!ref || r.booking_reference === ref) &&
                      (r.status === "pending" || r.status === "failed"),
                  );
                  return { results: rows };
                }
                return { results: [] };
              },
            };
          },
        };
      },
    } as unknown as D1Database;
    return env;
  }

  it("one confirmed booking creates one internal notification only", async () => {
    const env = envWithDb();
    const b = booking();
    const first = await enqueueInternalBookingNotification(env, b);
    const second = await enqueueInternalBookingNotification(env, b);
    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(outbox.filter((r) => r.kind === "internal")).toHaveLength(1);
    expect(outbox.some((r) => r.kind === "confirmation")).toBe(false);
    expect(outbox.some((r) => r.kind === "supplier")).toBe(false);
  });

  it("provider success marks sent; customer confirmation is not sent", async () => {
    sendMock.mockReturnValue({ ok: true, id: "re_msg_1" });
    const env = envWithDb();
    await enqueueInternalBookingNotification(env, booking());
    await deliverInternalOutboxForBooking(env, "VF-TEST01");
    expect(outbox[0]?.status).toBe("sent");
    expect(outbox[0]?.provider_message_id).toBe("re_msg_1");
    expect(bookings.get("VF-TEST01")?.email_internal_sent_at).toBeTruthy();
    expect(bookings.get("VF-TEST01")?.email_confirmation_sent_at).toBeNull();
  });

  it("provider failure keeps row retryable; retry succeeds without duplication", async () => {
    sendMock
      .mockReturnValueOnce({ ok: false, error: "timeout" })
      .mockReturnValueOnce({ ok: true, id: "re_msg_2" });
    const env = envWithDb();
    await enqueueInternalBookingNotification(env, booking());
    await deliverInternalOutboxForBooking(env, "VF-TEST01");
    expect(outbox).toHaveLength(1);
    expect(outbox[0]?.status).toBe("failed");

    await deliverInternalOutboxForBooking(env, "VF-TEST01");
    expect(outbox).toHaveLength(1);
    expect(outbox[0]?.status).toBe("sent");
    expect(outbox[0]?.provider_message_id).toBe("re_msg_2");
    expect(outbox[0]?.attempts).toBe(2);
  });

  it("sendViaResend reports acceptance only when provider returns an id", async () => {
    sendMock.mockReturnValue({ ok: true, id: "re_abc" });
    const result = await sendViaResend(mockEnv(), {
      to: "info@wowatour.com",
      subject: "t",
      text: "t",
      html: "<p>t</p>",
    });
    expect(result).toEqual({ accepted: true, messageId: "re_abc" });
  });
});
