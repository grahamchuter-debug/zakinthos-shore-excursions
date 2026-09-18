import Stripe from "stripe";

import type { PaymentsEnv } from "./types";

export function createStripe(env: PaymentsEnv): Stripe {
  if (!env.STRIPE_SECRET_KEY?.startsWith("sk_")) {
    throw new Error("STRIPE_SECRET_KEY is missing or invalid");
  }

  return new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
    apiVersion: "2025-08-27.basil",
  });
}
