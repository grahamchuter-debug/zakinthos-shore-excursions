import { BUSINESS_DECISION_REQUIRED } from "@/lib/legal/constants";
import { businessIdentity } from "@/lib/legal/business-identity";
import type { ContactPageContent } from "@/lib/legal/types";

/**
 * Contact page — only verified details are shown.
 * Telephone and WhatsApp remain pending until supplied and confirmed.
 */
export const contactContent: ContactPageContent = {
  path: "/contact",
  title: "Contact Us",
  metaDescription:
    "Contact the Villefranche Shore Excursions cruise excursion team for booking help and port-day questions.",
  lastUpdated: BUSINESS_DECISION_REQUIRED,
  lead: "Need help before booking? Our cruise excursion team is here to assist with availability, ship schedules and meeting arrangements.",
  details: [
    {
      id: "email",
      label: "Customer-service email",
      value: businessIdentity.customerServiceEmail,
      href: businessIdentity.customerServiceEmailHref,
    },
    {
      id: "telephone",
      label: "Telephone",
      value: BUSINESS_DECISION_REQUIRED,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: BUSINESS_DECISION_REQUIRED,
    },
    {
      id: "opening-hours",
      label: "Opening hours",
      value: BUSINESS_DECISION_REQUIRED,
    },
    {
      id: "urgent-day-of",
      label: "Urgent day-of-tour assistance",
      value: BUSINESS_DECISION_REQUIRED,
    },
    {
      id: "company-details",
      label: "Company details",
      value: businessIdentity.companyDisclosure,
    },
  ],
  closingParagraphs: [
    "Please include your cruise date, ship name and guest numbers when you write to us so we can help more quickly.",
    businessIdentity.agentStatus,
  ],
};
