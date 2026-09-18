import {
  createBookingReference,
  createIdempotencyKeySync,
} from "../booking-ref";
import { getExcursionProduct } from "../catalogue";
import { jsonResponse } from "../cors";
import {
  abandonIncompleteCheckout,
  getBookingByIdempotencyKey,
  insertBooking,
  markCheckoutCreateFailed,
  updateBookingStripeIds,
} from "../db";
import {
  getPricePerGuest,
  getCurrencyForExcursion,
  MAX_GUESTS,
  MIN_GUESTS,
} from "../pricing";
import { buildCheckoutRedirectUrls } from "../redirects";
import { resolveShipForDate, validateExcursionDate } from "../schedule";
import { createStripe } from "../stripe-client";
import type { CreateCheckoutBody, PaymentsEnv } from "../types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseBody(raw: unknown): CreateCheckoutBody | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as CreateCheckoutBody;
}

export async function handleCreateCheckoutSession(
  request: Request,
  env: PaymentsEnv,
): Promise<Response> {
  let body: CreateCheckoutBody | null = null;
  try {
    body = parseBody(await request.json());
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, request, env);
  }

  if (!body) {
    return jsonResponse({ error: "Invalid request body" }, 400, request, env);
  }

  const errors: string[] = [];
  if (!isNonEmptyString(body.excursionId)) errors.push("excursionId is required");
  if (!isNonEmptyString(body.excursionDate)) {
    errors.push("excursionDate must be YYYY-MM-DD");
  }
  if (!isNonEmptyString(body.customerEmail) || !EMAIL_RE.test(body.customerEmail.trim())) {
    errors.push("customerEmail is required");
  }
  if (!isNonEmptyString(body.customerName)) errors.push("customerName is required");

  const totalGuests = Number(body.totalGuests);
  if (!Number.isInteger(totalGuests) || totalGuests < MIN_GUESTS || totalGuests > MAX_GUESTS) {
    errors.push(`totalGuests must be an integer from ${MIN_GUESTS} to ${MAX_GUESTS}`);
  }

  if (errors.length > 0) {
    return jsonResponse({ error: "Validation failed", details: errors }, 400, request, env);
  }

  const product = getExcursionProduct(body.excursionId.trim());
  if (!product) {
    return jsonResponse(
      { error: "Unknown excursionId", details: ["excursionId is not in the product catalogue"] },
      400,
      request,
      env,
    );
  }

  const dateCheck = validateExcursionDate(body.excursionDate);
  if (!dateCheck.ok) {
    return jsonResponse(
      { error: "Validation failed", details: [dateCheck.error] },
      400,
      request,
      env,
    );
  }

  const shipResult = resolveShipForDate({
    excursionDate: body.excursionDate,
    shipId: typeof body.shipId === "string" ? body.shipId : null,
    shipNameHint: typeof body.shipName === "string" ? body.shipName : null,
  });
  if (!shipResult.ok) {
    return jsonResponse(
      { error: "Validation failed", details: [shipResult.error] },
      400,
      request,
      env,
    );
  }
  const { ship } = shipResult;

  let pricePerGuest: number;
  try {
    pricePerGuest = getPricePerGuest(env, product.id);
  } catch (err) {
    console.error("pricing_config_error", String(err));
    return jsonResponse(
      { error: "Payments pricing is not configured" },
      503,
      request,
      env,
    );
  }

  let successUrl: string;
  let cancelUrl: string;
  try {
    ({ successUrl, cancelUrl } = buildCheckoutRedirectUrls(env, product));
  } catch (err) {
    console.error("redirect_config_error", String(err));
    return jsonResponse(
      { error: "SITE_BASE_URL is not configured" },
      503,
      request,
      env,
    );
  }

  // Ignore any client-supplied successUrl / cancelUrl (open-redirect hardening).
  if (
    ("successUrl" in body && body.successUrl != null) ||
    ("cancelUrl" in body && body.cancelUrl != null)
  ) {
    console.warn(
      JSON.stringify({
        ignored_client_redirects: true,
        reason: "redirects are built from SITE_BASE_URL only",
      }),
    );
  }

  const adults =
    typeof body.adults === "number" && Number.isInteger(body.adults)
      ? body.adults
      : totalGuests;
  const children =
    typeof body.children === "number" && Number.isInteger(body.children)
      ? body.children
      : 0;

  if (adults + children !== totalGuests) {
    return jsonResponse(
      { error: "adults + children must equal totalGuests" },
      400,
      request,
      env,
    );
  }

  const { unitAmountCents, amountTotalCents } = calculateAmountCents(
    totalGuests,
    pricePerGuest,
  );
  const currency = getCurrencyForExcursion(env, product.id);

  if (
    typeof body.clientDisplayedTotalEur === "number" &&
    Number.isFinite(body.clientDisplayedTotalEur)
  ) {
    const clientCents = Math.round(body.clientDisplayedTotalEur * 100);
    if (clientCents !== amountTotalCents) {
      console.warn(
        JSON.stringify({
          price_mismatch: true,
          clientCents,
          serverCents: amountTotalCents,
        }),
      );
    }
  }

  const bookingSessionId =
    typeof body.bookingSessionId === "string" ? body.bookingSessionId : "";
  const shipIdForKey = ship.shipId ?? "not-listed";

  // v1: cancellation protection is disabled (not server-priced). Always 0.
  const cancellationProtection = 0;
  if (body.cancellationProtection) {
    console.warn(
      JSON.stringify({
        cancellation_protection_ignored: true,
        reason: "v1 does not offer priced cancellation protection",
      }),
    );
  }

  let idempotencyKey = createIdempotencyKeySync({
    excursionId: product.id,
    excursionDate: body.excursionDate,
    shipId: shipIdForKey,
    totalGuests,
    customerEmail: body.customerEmail.trim(),
    bookingSessionId,
  });

  const existing = await getBookingByIdempotencyKey(env, idempotencyKey);
  if (existing) {
    if (existing.stripe_checkout_session_id && existing.status === "awaiting_payment") {
      try {
        const stripe = createStripe(env);
        const session = await stripe.checkout.sessions.retrieve(
          existing.stripe_checkout_session_id,
        );
        if (session.url && session.status !== "expired") {
          return jsonResponse(
            {
              url: session.url,
              bookingReference: existing.booking_reference,
              sessionId: session.id,
            },
            200,
            request,
            env,
          );
        }
      } catch (err) {
        console.warn("reuse_session_failed", String(err));
      }
      // Expired / unusable — free the key and continue with a salted attempt.
      await abandonIncompleteCheckout(env, existing.booking_reference);
      idempotencyKey = createIdempotencyKeySync({
        excursionId: product.id,
        excursionDate: body.excursionDate,
        shipId: shipIdForKey,
        totalGuests,
        customerEmail: body.customerEmail.trim(),
        bookingSessionId,
        attemptSalt: crypto.randomUUID(),
      });
    } else if (!existing.stripe_checkout_session_id) {
      // Prior insert succeeded but Stripe create failed — free key for retry.
      await abandonIncompleteCheckout(env, existing.booking_reference);
    } else {
      // Terminal / other status holding the key — new salted attempt.
      idempotencyKey = createIdempotencyKeySync({
        excursionId: product.id,
        excursionDate: body.excursionDate,
        shipId: shipIdForKey,
        totalGuests,
        customerEmail: body.customerEmail.trim(),
        bookingSessionId,
        attemptSalt: crypto.randomUUID(),
      });
    }
  }

  const bookingReference = createBookingReference(env.BOOKING_REF_PREFIX ?? "XX");
  const bookingId = crypto.randomUUID();
  const now = new Date().toISOString();
  const originatingSite = env.ORIGINATING_SITE ?? "example.com";
  const originatingPort = env.ORIGINATING_PORT ?? "Port";

  const metadata: Record<string, string> = {
    booking_ref: bookingReference,
    excursion_id: product.id.slice(0, 40),
    excursion_name: product.name.slice(0, 80),
    excursion_date: body.excursionDate,
    ship_id: shipIdForKey.slice(0, 40),
    ship_name: ship.shipName.slice(0, 80),
    adults: String(adults),
    children: String(children),
    total_guests: String(totalGuests),
    currency,
    cancel_prot: "0",
    site: originatingSite.slice(0, 40),
    port: originatingPort.slice(0, 40),
  };
  if (bookingSessionId) {
    metadata.booking_session_id = bookingSessionId.slice(0, 40);
  }

  try {
    await insertBooking(env, {
      id: bookingId,
      booking_reference: bookingReference,
      status: "awaiting_payment",
      excursion_id: product.id,
      excursion_name: product.name,
      excursion_date: body.excursionDate,
      ship_id: ship.isCustom ? null : ship.shipId,
      ship_name: ship.shipName,
      adults,
      children,
      total_guests: totalGuests,
      currency,
      amount_total_cents: amountTotalCents,
      unit_amount_cents: unitAmountCents,
      cancellation_protection: cancellationProtection,
      originating_site: originatingSite,
      originating_port: originatingPort,
      booking_session_id: bookingSessionId || null,
      customer_email: body.customerEmail.trim().toLowerCase(),
      customer_name: body.customerName.trim(),
      customer_phone: null,
      stripe_checkout_session_id: null,
      stripe_payment_intent_id: null,
      idempotency_key: idempotencyKey,
      created_at: now,
      updated_at: now,
    });
  } catch (err) {
    const raced = await getBookingByIdempotencyKey(env, idempotencyKey);
    if (raced?.stripe_checkout_session_id) {
      try {
        const stripe = createStripe(env);
        const session = await stripe.checkout.sessions.retrieve(
          raced.stripe_checkout_session_id,
        );
        if (session.url) {
          return jsonResponse(
            {
              url: session.url,
              bookingReference: raced.booking_reference,
              sessionId: session.id,
            },
            200,
            request,
            env,
          );
        }
      } catch (retrieveErr) {
        console.warn("race_retrieve_failed", String(retrieveErr));
      }
    }
    if (raced && !raced.stripe_checkout_session_id) {
      // Concurrent create left an incomplete row — abandon and ask client to retry.
      await abandonIncompleteCheckout(env, raced.booking_reference);
    }
    console.error("insert_booking_failed", String(err));
    return jsonResponse({ error: "Could not create booking" }, 500, request, env);
  }

  const lineDescription = [
    product.name,
    body.excursionDate,
    ship.shipName,
    `${totalGuests} guest${totalGuests === 1 ? "" : "s"}`,
  ].join(" · ");

  try {
    const stripe = createStripe(env);
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        client_reference_id: bookingReference,
        customer_email: body.customerEmail.trim().toLowerCase(),
        customer_creation: "if_required",
        phone_number_collection: { enabled: true },
        billing_address_collection: "auto",
        line_items: [
          {
            quantity: totalGuests,
            price_data: {
              currency,
              unit_amount: unitAmountCents,
              product_data: {
                name: product.name.slice(0, 120),
                description: lineDescription.slice(0, 500),
                metadata: {
                  excursion_id: product.id.slice(0, 40),
                },
              },
            },
          },
        ],
        metadata,
        payment_intent_data: {
          metadata,
          description: lineDescription.slice(0, 1000),
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      },
      { idempotencyKey },
    );

    if (!session.url) {
      await markCheckoutCreateFailed(env, bookingReference);
      return jsonResponse(
        { error: "Stripe did not return a Checkout URL" },
        502,
        request,
        env,
      );
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    await updateBookingStripeIds(
      env,
      bookingReference,
      session.id,
      paymentIntentId,
    );

    return jsonResponse(
      {
        url: session.url,
        bookingReference,
        sessionId: session.id,
      },
      200,
      request,
      env,
    );
  } catch (err) {
    console.error("stripe_session_create_failed", String(err));
    try {
      await markCheckoutCreateFailed(env, bookingReference);
    } catch (markErr) {
      console.error("mark_checkout_failed_error", String(markErr));
    }
    return jsonResponse(
      { error: "Could not start secure payment" },
      502,
      request,
      env,
    );
  }
}

/** Exported for unit tests — recovery path after Stripe create failure. */
export { markCheckoutCreateFailed, abandonIncompleteCheckout };
