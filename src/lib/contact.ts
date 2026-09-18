/**
 * World 2.0 public contact resolution.
 *
 * CENTRAL (default): single ops inbox — never display destination-local addresses.
 * LOCAL: destination hello/bookings/privacy — only after email forwarding is live.
 */

import { destinationConfig } from "@/config/destination";

export type ContactMode = "central" | "local";

/** Network operations inbox — used in central mode for all public contact. */
export const CENTRAL_OPS_EMAIL = "info@wowatour.com";

export type ResolvedContact = {
  mode: ContactMode;
  /** Primary public address (footer, schema, enquire). */
  primary: string;
  hello: string;
  bookings: string;
  privacy: string;
  /** True only in local mode — UI may list role-specific addresses. */
  showDestinationEmails: boolean;
};

export function resolvePublicContact(
  mode: ContactMode = destinationConfig.contactMode,
  local = destinationConfig.contact,
): ResolvedContact {
  if (mode === "central") {
    return {
      mode: "central",
      primary: CENTRAL_OPS_EMAIL,
      hello: CENTRAL_OPS_EMAIL,
      bookings: CENTRAL_OPS_EMAIL,
      privacy: CENTRAL_OPS_EMAIL,
      showDestinationEmails: false,
    };
  }
  return {
    mode: "local",
    primary: local.hello,
    hello: local.hello,
    bookings: local.bookings,
    privacy: local.privacy,
    showDestinationEmails: true,
  };
}

export const publicContact = resolvePublicContact();
