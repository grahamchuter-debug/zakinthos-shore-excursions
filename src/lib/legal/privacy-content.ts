import { BUSINESS_DECISION_REQUIRED } from "@/lib/legal/constants";
import { businessIdentity } from "@/lib/legal/business-identity";
import type { LegalPageContent } from "@/lib/legal/types";

/**
 * Privacy policy draft. Does not invent ICO number or retention periods —
 * those remain BUSINESS_DECISION_REQUIRED.
 */
export const privacyContent: LegalPageContent = {
  path: "/privacy-policy",
  title: "Privacy Policy",
  metaDescription:
    "How Villefranche Shore Excursions collects and uses personal information when you enquire about or book a shore excursion.",
  lastUpdated: BUSINESS_DECISION_REQUIRED,
  lead: `This privacy notice explains how ${businessIdentity.tradingName} handles personal information when you use our website or make a booking enquiry.`,
  sections: [
    {
      id: "who-controls-data",
      title: "Who controls the data",
      paragraphs: [
        `${businessIdentity.tradingName} handles the personal information you provide through this website for booking and customer-service purposes.`,
        businessIdentity.legalEntityStatement,
        `${businessIdentity.legalCompanyName} is registered in ${businessIdentity.registeredJurisdiction} under company number ${businessIdentity.companyNumber}. Registered office: ${businessIdentity.registeredOffice.formatted}.`,
      ],
    },
    {
      id: "information-collected",
      title: "Information collected",
      paragraphs: [
        "We may collect your name, email address, booking preferences, cruise date, ship details, guest numbers and messages you send us.",
        "If you complete a card payment, payment details are collected by our payment provider rather than stored as full card numbers on this website.",
      ],
    },
    {
      id: "why-collected",
      title: "Why it is collected",
      paragraphs: [
        "We use this information to respond to enquiries, confirm bookings, provide meeting instructions, and communicate about your excursion.",
        BUSINESS_DECISION_REQUIRED, // lawful bases under GDPR once advised
      ],
    },
    {
      id: "payment-processing",
      title: "Payment processing through Stripe",
      paragraphs: [
        "Online payments are intended to be processed by Stripe. Stripe handles card details according to its own security and privacy terms.",
        "We receive payment confirmation details needed to manage your booking, not your full card number.",
      ],
    },
    {
      id: "communications",
      title: "Communications",
      paragraphs: [
        "We use your contact details to send booking-related messages such as confirmations, meeting instructions and responses to your questions.",
        BUSINESS_DECISION_REQUIRED, // marketing consent approach
      ],
    },
    {
      id: "cookies-and-analytics",
      title: "Cookies and analytics",
      pendingApproval: true,
      paragraphs: [
        BUSINESS_DECISION_REQUIRED, // cookie/analytics stack not confirmed
      ],
    },
    {
      id: "suppliers-and-providers",
      title: "Suppliers and service providers",
      paragraphs: [
        "We may share booking details with the local excursion provider and service providers who help us deliver the tour, process payments or host the website.",
        "We only share what is needed to provide the service you requested.",
      ],
    },
    {
      id: "international-transfers",
      title: "International transfers",
      pendingApproval: true,
      paragraphs: [
        BUSINESS_DECISION_REQUIRED, // transfer mechanisms once advised
      ],
    },
    {
      id: "retention",
      title: "Retention",
      pendingApproval: true,
      paragraphs: [
        BUSINESS_DECISION_REQUIRED, // retention periods
      ],
    },
    {
      id: "customer-rights",
      title: "Customer rights",
      paragraphs: [
        "Depending on applicable law, you may have rights to access, correct or delete personal information we hold about you, or to ask us about how it is used.",
        `To make a privacy request, contact ${businessIdentity.privacyEmail}.`,
        BUSINESS_DECISION_REQUIRED, // formal rights list / supervisory authority
      ],
    },
    {
      id: "contact-details",
      title: "Contact details",
      paragraphs: [
        `Privacy enquiries: ${businessIdentity.privacyEmail}`,
        businessIdentity.companyDisclosure,
      ],
    },
  ],
};
