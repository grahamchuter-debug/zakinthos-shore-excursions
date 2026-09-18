import { describe, expect, it } from "vitest";

/**
 * Legacy stub tests removed — v1 uses Resend for internal alerts only.
 * See internal-email.test.ts for outbox + provider behaviour.
 */
describe("email module v1", () => {
  it("documents that customer/supplier automation is deferred", () => {
    expect(true).toBe(true);
  });
});
