import type { PaymentsEnv } from "./types";

const LOCALHOST_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
] as const;

/** Strip whitespace and a single trailing slash — Origins never include a path. */
export function normalizeOrigin(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Parse an origin from SITE_BASE_URL / SITE_ORIGIN / allow-list entries.
 * Rejects values with a path other than `/` so we never compare full URLs.
 */
export function originFromConfiguredUrl(
  value: string | null | undefined,
): string | null {
  const normalized = normalizeOrigin(value);
  if (!normalized) return null;
  try {
    const url = new URL(normalized);
    if (url.username || url.password) return null;
    return normalizeOrigin(url.origin);
  } catch {
    return null;
  }
}

function allowedOrigins(env: PaymentsEnv): Set<string> {
  const set = new Set<string>();
  for (const local of LOCALHOST_ORIGINS) set.add(local);

  const siteOrigin = originFromConfiguredUrl(env.SITE_ORIGIN);
  if (siteOrigin) set.add(siteOrigin);

  const siteBase = originFromConfiguredUrl(env.SITE_BASE_URL);
  if (siteBase) set.add(siteBase);

  for (const part of (env.CORS_ALLOWED_ORIGINS ?? "").split(",")) {
    const origin = originFromConfiguredUrl(part);
    if (origin) set.add(origin);
  }

  return set;
}

/**
 * CORS headers for browser calls to the payments API.
 *
 * Access-Control-Allow-Origin is set only when the request Origin is on the
 * allow-list, and then it is echoed exactly (never substituted with a different
 * host such as www vs apex). That mismatch is what browsers reject as
 * “Failed to fetch” after a 2xx OPTIONS.
 */
export function corsHeaders(
  request: Request,
  env: PaymentsEnv,
): Record<string, string> {
  const requestOrigin = normalizeOrigin(request.headers.get("Origin"));
  const allowed = allowedOrigins(env);

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (requestOrigin && allowed.has(requestOrigin)) {
    headers["Access-Control-Allow-Origin"] = requestOrigin;
  }

  return headers;
}

export function jsonResponse(
  data: unknown,
  status: number,
  request: Request,
  env: PaymentsEnv,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request, env),
    },
  });
}

export function optionsResponse(request: Request, env: PaymentsEnv): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env),
  });
}
