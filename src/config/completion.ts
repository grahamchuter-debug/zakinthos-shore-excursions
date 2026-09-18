/**
 * Internal destination completion tracker — not rendered publicly.
 * Update statuses as work progresses. Used by ops and World 2.0 audits.
 */

export type CompletionState = "pending" | "in-progress" | "complete";

export type CompletionSection =
  | "editorial"
  | "images"
  | "products"
  | "pricing"
  | "schedules"
  | "booking"
  | "stripe"
  | "worker"
  | "d1"
  | "searchConsole"
  | "analytics"
  | "productionImages"
  | "deployment";

export type DestinationCompletion = Record<CompletionSection, CompletionState>;

export const destinationCompletion = {
  editorial: "complete",
  images: "in-progress",
  products: "in-progress",
  pricing: "pending",
  schedules: "pending",
  booking: "pending",
  stripe: "pending",
  worker: "pending",
  d1: "pending",
  searchConsole: "pending",
  analytics: "pending",
  productionImages: "pending",
  deployment: "complete",
} as const satisfies DestinationCompletion;
