/**
 * Stripe Checkout create failure + retry recovery.
 *
 * Scenario: D1 awaiting_payment row inserted, Stripe session create fails.
 * Retry must not remain blocked by the original idempotency_key.
 */

import { createIdempotencyKeySync } from "../booking-ref";
import { describe, expect, it, vi } from "vitest";

type BookingStub = {
  booking_reference: string;
  status: string;
  stripe_checkout_session_id: string | null;
  idempotency_key: string;
};

function createMemoryDb() {
  const byKey = new Map<string, BookingStub>();
  const byRef = new Map<string, BookingStub>();

  return {
    byKey,
    byRef,
    async getByIdempotencyKey(key: string) {
      return byKey.get(key) ?? null;
    },
    async insert(row: BookingStub) {
      if (byKey.has(row.idempotency_key)) {
        throw new Error("UNIQUE constraint failed: bookings.idempotency_key");
      }
      byKey.set(row.idempotency_key, row);
      byRef.set(row.booking_reference, row);
    },
    async markCheckoutCreateFailed(bookingReference: string) {
      const row = byRef.get(bookingReference);
      if (!row) throw new Error("missing booking");
      byKey.delete(row.idempotency_key);
      row.status = "payment_failed";
      row.idempotency_key = `abandoned:${crypto.randomUUID()}`;
      byKey.set(row.idempotency_key, row);
    },
    async updateStripeIds(bookingReference: string, sessionId: string) {
      const row = byRef.get(bookingReference);
      if (!row) throw new Error("missing booking");
      row.stripe_checkout_session_id = sessionId;
    },
  };
}

/**
 * Mirrors create-checkout recovery: insert → Stripe fail → mark failed →
 * retry insert with same logical key → Stripe success.
 */
async function runCheckoutAttempt(args: {
  db: ReturnType<typeof createMemoryDb>;
  idempotencyKey: string;
  bookingReference: string;
  stripeCreate: () => Promise<{ id: string; url: string }>;
}): Promise<{ ok: true; sessionId: string } | { ok: false; error: string }> {
  const existing = await args.db.getByIdempotencyKey(args.idempotencyKey);
  let key = args.idempotencyKey;

  if (existing) {
    if (existing.stripe_checkout_session_id && existing.status === "awaiting_payment") {
      return { ok: true, sessionId: existing.stripe_checkout_session_id };
    }
    if (!existing.stripe_checkout_session_id) {
      await args.db.markCheckoutCreateFailed(existing.booking_reference);
    } else {
      key = createIdempotencyKeySync({
        excursionId: "monaco-monte-carlo-eze-small-group",
        excursionDate: "2026-07-14",
        shipId: "norwegian-epic",
        totalGuests: 2,
        customerEmail: "guest@example.com",
        bookingSessionId: "sess-1",
        attemptSalt: crypto.randomUUID(),
      });
    }
  }

  await args.db.insert({
    booking_reference: args.bookingReference,
    status: "awaiting_payment",
    stripe_checkout_session_id: null,
    idempotency_key: key,
  });

  try {
    const session = await args.stripeCreate();
    await args.db.updateStripeIds(args.bookingReference, session.id);
    return { ok: true, sessionId: session.id };
  } catch (err) {
    await args.db.markCheckoutCreateFailed(args.bookingReference);
    return { ok: false, error: String(err) };
  }
}

describe("Stripe session create failure recovery", () => {
  it("retries cleanly after D1 insert + Stripe create failure", async () => {
    const db = createMemoryDb();
    const idempotencyKey = createIdempotencyKeySync({
      excursionId: "monaco-monte-carlo-eze-small-group",
      excursionDate: "2026-07-14",
      shipId: "norwegian-epic",
      totalGuests: 2,
      customerEmail: "guest@example.com",
      bookingSessionId: "sess-1",
    });

    const stripeCreate = vi
      .fn()
      .mockRejectedValueOnce(new Error("stripe_unavailable"))
      .mockResolvedValueOnce({
        id: "cs_test_retry_ok",
        url: "https://checkout.stripe.com/c/pay/cs_test_retry_ok",
      });

    const first = await runCheckoutAttempt({
      db,
      idempotencyKey,
      bookingReference: "VF-FIRST001",
      stripeCreate,
    });
    expect(first.ok).toBe(false);
    expect(await db.getByIdempotencyKey(idempotencyKey)).toBeNull();

    const second = await runCheckoutAttempt({
      db,
      idempotencyKey,
      bookingReference: "VF-RETRY002",
      stripeCreate,
    });
    expect(second).toEqual({ ok: true, sessionId: "cs_test_retry_ok" });
    expect(stripeCreate).toHaveBeenCalledTimes(2);

    const recovered = await db.getByIdempotencyKey(idempotencyKey);
    expect(recovered?.stripe_checkout_session_id).toBe("cs_test_retry_ok");
    expect(recovered?.status).toBe("awaiting_payment");
  });

  it("does not leave the original idempotency key occupied after failure", async () => {
    const db = createMemoryDb();
    const key = createIdempotencyKeySync({
      excursionId: "monaco-monte-carlo-eze-small-group",
      excursionDate: "2026-07-14",
      shipId: "norwegian-epic",
      totalGuests: 2,
      customerEmail: "guest@example.com",
      bookingSessionId: "sess-2",
    });

    await db.insert({
      booking_reference: "VF-STUCK01",
      status: "awaiting_payment",
      stripe_checkout_session_id: null,
      idempotency_key: key,
    });

    await db.markCheckoutCreateFailed("VF-STUCK01");
    expect(await db.getByIdempotencyKey(key)).toBeNull();

    await expect(
      db.insert({
        booking_reference: "VF-FRESH01",
        status: "awaiting_payment",
        stripe_checkout_session_id: null,
        idempotency_key: key,
      }),
    ).resolves.toBeUndefined();
  });
});
