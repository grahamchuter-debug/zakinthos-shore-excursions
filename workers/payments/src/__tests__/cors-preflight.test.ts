import { describe, expect, it } from "vitest";
import {
  corsHeaders,
  jsonResponse,
  normalizeOrigin,
  optionsResponse,
  originFromConfiguredUrl,
} from "../cors";
import type { PaymentsEnv } from "../types";

const PRODUCTION_ORIGIN = "https://villefrancheshoreexcursions.com";

function mockEnv(overrides: Partial<PaymentsEnv> = {}): PaymentsEnv {
  return {
    DB: {} as D1Database,
    STRIPE_SECRET_KEY: "sk_test_x",
    STRIPE_WEBHOOK_SECRET: "whsec_x",
    BOOKING_PRICE_PER_GUEST_EUR: "149",
    SITE_BASE_URL: PRODUCTION_ORIGIN,
    SITE_ORIGIN: PRODUCTION_ORIGIN,
    ...overrides,
  };
}

function preflightRequest(origin: string): Request {
  return new Request("https://villefranche-payments.example/api/checkout/session", {
    method: "OPTIONS",
    headers: {
      Origin: origin,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type",
    },
  });
}

describe("origin normalization", () => {
  it("strips trailing slashes from SITE_ORIGIN / SITE_BASE_URL", () => {
    expect(normalizeOrigin(`${PRODUCTION_ORIGIN}/`)).toBe(PRODUCTION_ORIGIN);
    expect(originFromConfiguredUrl(`${PRODUCTION_ORIGIN}/`)).toBe(PRODUCTION_ORIGIN);
    expect(originFromConfiguredUrl(`${PRODUCTION_ORIGIN}/book/x`)).toBe(
      PRODUCTION_ORIGIN,
    );
  });

  it("does not treat www and apex as the same origin", () => {
    expect(originFromConfiguredUrl(PRODUCTION_ORIGIN)).toBe(PRODUCTION_ORIGIN);
    expect(originFromConfiguredUrl("https://www.villefrancheshoreexcursions.com")).toBe(
      "https://www.villefrancheshoreexcursions.com",
    );
  });
});

describe("CORS preflight (OPTIONS)", () => {
  it("returns the full required preflight headers for the production origin", () => {
    const env = mockEnv();
    const response = optionsResponse(preflightRequest(PRODUCTION_ORIGIN), env);

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      PRODUCTION_ORIGIN,
    );
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST, OPTIONS",
    );
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("OPTIONS");
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe("Content-Type");
    expect(response.headers.get("Access-Control-Allow-Headers")).toContain(
      "Content-Type",
    );
    expect(response.headers.get("Vary")).toBe("Origin");
  });

  it("echoes Origin exactly and never substitutes apex when www is not allow-listed", () => {
    const env = mockEnv();
    const www = "https://www.villefrancheshoreexcursions.com";
    const headers = corsHeaders(preflightRequest(www), env);

    // Must not claim Allow-Origin for a different host — that fails browser CORS.
    expect(headers["Access-Control-Allow-Origin"]).toBeUndefined();
    expect(headers["Access-Control-Allow-Origin"]).not.toBe(PRODUCTION_ORIGIN);
    expect(headers.Vary).toBe("Origin");
    expect(headers["Access-Control-Allow-Methods"]).toContain("POST");
    expect(headers["Access-Control-Allow-Headers"]).toContain("Content-Type");
  });

  it("allows www only when explicitly configured, and echoes www exactly", () => {
    const www = "https://www.villefrancheshoreexcursions.com";
    const env = mockEnv({
      CORS_ALLOWED_ORIGINS: www,
    });
    const response = optionsResponse(preflightRequest(www), env);

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(www);
    expect(response.headers.get("Access-Control-Allow-Origin")).not.toBe(
      PRODUCTION_ORIGIN,
    );
  });

  it("still returns Methods/Headers/Vary on json error responses", () => {
    const env = mockEnv();
    const request = new Request(
      "https://villefranche-payments.example/api/checkout/session",
      {
        method: "POST",
        headers: {
          Origin: PRODUCTION_ORIGIN,
          "Content-Type": "application/json",
        },
      },
    );
    const response = jsonResponse({ error: "Validation failed" }, 400, request, env);

    expect(response.status).toBe(400);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      PRODUCTION_ORIGIN,
    );
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    expect(response.headers.get("Access-Control-Allow-Headers")).toContain(
      "Content-Type",
    );
    expect(response.headers.get("Vary")).toBe("Origin");
  });
});
