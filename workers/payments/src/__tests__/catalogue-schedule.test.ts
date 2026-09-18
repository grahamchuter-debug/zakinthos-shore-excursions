import { describe, expect, it } from "vitest";

import { getExcursionProduct } from "../catalogue";
import { buildCheckoutRedirectUrls } from "../redirects";
import {
  resolveShipForDate,
  validateExcursionDate,
} from "../schedule";
import type { PaymentsEnv } from "../types";

describe("catalogue + redirects", () => {
  it("resolves the Monaco product and builds trusted redirect URLs", () => {
    const product = getExcursionProduct("monaco-monte-carlo-eze-small-group");
    expect(product?.name).toContain("Monaco");

    const env = {
      SITE_BASE_URL: "https://villefrancheshoreexcursions.com",
    } as PaymentsEnv;

    const urls = buildCheckoutRedirectUrls(env, product!);
    expect(urls.successUrl).toBe(
      "https://villefrancheshoreexcursions.com/book/small-group-monaco-monte-carlo-eze/success?session_id={CHECKOUT_SESSION_ID}",
    );
    expect(urls.cancelUrl).toBe(
      "https://villefrancheshoreexcursions.com/book/small-group-monaco-monte-carlo-eze?checkout=cancelled",
    );
  });

  it("rejects unknown excursion ids", () => {
    expect(getExcursionProduct("not-a-real-tour")).toBeNull();
  });
});

describe("schedule validation", () => {
  it("rejects past dates", () => {
    const result = validateExcursionDate("2020-01-01", "2026-07-18");
    expect(result.ok).toBe(false);
  });

  it("accepts a date inside the bookable window", () => {
    const result = validateExcursionDate("2026-07-14", "2026-07-01");
    expect(result.ok).toBe(true);
  });

  it("resolves a scheduled ship by slug and overwrites the name", () => {
    const result = resolveShipForDate({
      excursionDate: "2026-07-14",
      shipId: "norwegian-epic",
      shipNameHint: "Fake Client Name",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.ship.shipName).toBe("Norwegian Epic");
      expect(result.ship.isCustom).toBe(false);
    }
  });

  it("rejects a ship that is not on that date", () => {
    const result = resolveShipForDate({
      excursionDate: "2026-07-14",
      shipId: "not-on-this-day",
      shipNameHint: "Nope",
    });
    expect(result.ok).toBe(false);
  });
});
