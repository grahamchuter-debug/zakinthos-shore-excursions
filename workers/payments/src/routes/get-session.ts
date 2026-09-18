import { jsonResponse } from "../cors";
import { getBookingByCheckoutSessionId } from "../db";
import { createStripe } from "../stripe-client";
import type { PaymentsEnv } from "../types";

const FINAL_BOOKING_STATUSES = new Set(["paid", "confirmed"]);

export async function handleGetCheckoutSession(
  request: Request,
  env: PaymentsEnv,
): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id")?.trim();

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return jsonResponse(
      { error: "session_id is required" },
      400,
      request,
      env,
    );
  }

  try {
    const stripe = createStripe(env);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const booking = await getBookingByCheckoutSessionId(env, sessionId);

    const paymentStatus = session.payment_status;
    const sessionStatus = session.status;
    const paid =
      paymentStatus === "paid" ||
      (booking ? FINAL_BOOKING_STATUSES.has(booking.status) : false);

    const bookingStatus = booking?.status ?? null;
    const bookingFinalised =
      bookingStatus != null && FINAL_BOOKING_STATUSES.has(bookingStatus);

    return jsonResponse(
      {
        sessionId: session.id,
        paymentStatus,
        sessionStatus,
        paid,
        /** True only when D1 reflects webhook-confirmed paid/confirmed. */
        bookingFinalised,
        bookingReference:
          booking?.booking_reference ??
          session.client_reference_id ??
          session.metadata?.booking_ref ??
          null,
        bookingStatus,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail:
          session.customer_details?.email ?? booking?.customer_email ?? null,
        customerName:
          session.customer_details?.name ?? booking?.customer_name ?? null,
        customerPhone:
          session.customer_details?.phone ?? booking?.customer_phone ?? null,
        metadata: session.metadata ?? {},
        excursionDate: booking?.excursion_date ?? session.metadata?.excursion_date ?? null,
        shipName: booking?.ship_name ?? session.metadata?.ship_name ?? null,
        totalGuests:
          booking?.total_guests ??
          (session.metadata?.total_guests
            ? Number(session.metadata.total_guests)
            : null),
        excursionName:
          booking?.excursion_name ?? session.metadata?.excursion_name ?? null,
      },
      200,
      request,
      env,
    );
  } catch (err) {
    console.error("get_session_failed", String(err));
    return jsonResponse(
      { error: "Could not verify payment session" },
      502,
      request,
      env,
    );
  }
}
