/**
 * World 2.0 destination identity — branding surface for logo/wordmark.
 * Driven by destination config; only logoConcept stays as a light local choice.
 */

import { destinationConfig } from "@/config/destination";

export type LogoConcept = "anchor-arch" | "harbour-m";
export type LogoVariant = "full" | "compact" | "mark";
export type LogoTone = "default" | "on-dark";

export const destinationIdentity = {
  destination: destinationConfig.destination,
  descriptor: destinationConfig.descriptor,
  strapline: destinationConfig.strapline,
  accessibleName: destinationConfig.name,
  accent: "coastal" as const,
  logoConcept: "anchor-arch" as LogoConcept,
  iconStyle: "anchor-arch" as const,
} as const;
