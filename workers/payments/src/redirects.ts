import type { ExcursionProduct } from "./catalogue";
import type { PaymentsEnv } from "./types";

/**
 * Build Checkout success/cancel URLs from trusted SITE_BASE_URL only.
 * Never accept browser-supplied redirect origins.
 */
export function getSiteBaseUrl(env: PaymentsEnv): string {
  const raw = (env.SITE_BASE_URL ?? env.SITE_ORIGIN ?? "").trim();
  if (!raw) {
    throw new Error("SITE_BASE_URL (or SITE_ORIGIN) is required");
  }
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("SITE_BASE_URL must be an absolute URL");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("SITE_BASE_URL must use http or https");
  }
  // Allow localhost http for local Next; production should be https.
  const host = url.hostname;
  const isLocal =
    host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  if (url.protocol === "http:" && !isLocal) {
    throw new Error("SITE_BASE_URL must use https outside localhost");
  }
  return `${url.origin}`;
}

export function buildCheckoutRedirectUrls(
  env: PaymentsEnv,
  product: ExcursionProduct,
): { successUrl: string; cancelUrl: string } {
  const base = getSiteBaseUrl(env);
  const successUrl = `${base}${product.successPath}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${base}${product.bookingPath}?checkout=cancelled`;
  return { successUrl, cancelUrl };
}
