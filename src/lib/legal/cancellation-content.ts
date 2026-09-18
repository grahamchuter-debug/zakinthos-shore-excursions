import { BUSINESS_DECISION_REQUIRED } from "@/lib/legal/constants";
import { businessIdentity } from "@/lib/legal/business-identity";
import type { CancellationPolicyContent } from "@/lib/legal/types";

/**
 * Cancellation policy draft. Refund windows and percentages remain unset until
 * business approval — unresolved fields are omitted from customer rendering.
 *
 * Supplier-cancellation and refund wording uses the shared preferred language
 * from businessIdentity so we do not imply Wow A Tour Ltd operates the excursion.
 */
export const cancellationContent: CancellationPolicyContent = {
  path: "/cancellation-policy",
  title: "Cancellation Policy",
  metaDescription:
    "Cancellation terms for Villefranche Shore Excursions bookings. Cruise plans can change — this page explains how cancellations are handled once terms are confirmed.",
  lastUpdated: BUSINESS_DECISION_REQUIRED,
  lead: "We understand that cruise plans can change. This page explains the cancellation terms that apply to your booking.",
  fields: [
    {
      id: "free-cancellation-cutoff",
      label: "Free-cancellation cutoff",
      value: BUSINESS_DECISION_REQUIRED,
    },
    {
      id: "refund-percentage",
      label: "Refund percentage",
      value: BUSINESS_DECISION_REQUIRED,
    },
    {
      id: "late-cancellation",
      label: "Late-cancellation treatment",
      value: BUSINESS_DECISION_REQUIRED,
    },
    {
      id: "no-show",
      label: "No-show treatment",
      value: BUSINESS_DECISION_REQUIRED,
    },
    {
      id: "cruise-ship-cancellation",
      label: "Cruise ship cancellation or missed-port treatment",
      value: BUSINESS_DECISION_REQUIRED,
    },
    {
      id: "supplier-cancellation",
      label: "If the local provider cancels, or the booking cannot be fulfilled",
      value: `${businessIdentity.cancellationLanguage.triggerStatement}, we will contact you as soon as practical. Where a refund is due, ${businessIdentity.cancellationLanguage.refundStatement.charAt(0).toLowerCase()}${businessIdentity.cancellationLanguage.refundStatement.slice(1)}`,
    },
    {
      id: "weather-cancellation",
      label: "Weather cancellation",
      value: BUSINESS_DECISION_REQUIRED,
    },
    {
      id: "refund-processing-times",
      label: "Refund processing times",
      value: BUSINESS_DECISION_REQUIRED,
    },
  ],
  closingParagraphs: [
    "Specific cancellation windows and refund amounts will be confirmed in your booking confirmation once the final policy values are approved.",
    `If you need to cancel or change a booking, contact us at ${businessIdentity.customerServiceEmail} as soon as possible so we can review your request.`,
    "This cancellation policy should be read together with our Booking Terms and Conditions.",
  ],
};
