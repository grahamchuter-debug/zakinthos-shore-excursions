import { BUSINESS_DECISION_REQUIRED } from "@/lib/legal/constants";
import { businessIdentity } from "@/lib/legal/business-identity";
import { cancellationContent } from "@/lib/legal/cancellation-content";
import { contactContent } from "@/lib/legal/contact-content";
import { privacyContent } from "@/lib/legal/privacy-content";
import { termsContent } from "@/lib/legal/terms-content";
import type { LegalText } from "@/lib/legal/types";
import { isPendingText } from "@/lib/legal/types";

export {
  businessIdentity,
  cancellationContent,
  contactContent,
  privacyContent,
  termsContent,
};

export const legalNavLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cancellation Policy", href: "/booking-conditions" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Contact Us", href: "/enquire" },
  { label: "Return to Ship Guarantee", href: "/return-to-ship-guarantee" },
] as const;

type ReportItem = {
  page: string;
  field: string;
  note: string;
};

function collectPendingFromTexts(
  page: string,
  prefix: string,
  texts: readonly LegalText[],
  items: ReportItem[],
) {
  texts.forEach((text, index) => {
    if (isPendingText(text)) {
      items.push({
        page,
        field: `${prefix}[${index}]`,
        note: BUSINESS_DECISION_REQUIRED,
      });
    }
  });
}

/** Fields still requiring business/legal input before launch. */
export function getLegalBusinessInputReport(): ReportItem[] {
  const items: ReportItem[] = [];

  if (isPendingText(termsContent.lastUpdated)) {
    items.push({
      page: termsContent.path,
      field: "lastUpdated",
      note: BUSINESS_DECISION_REQUIRED,
    });
  }
  for (const section of termsContent.sections) {
    if (section.pendingApproval) {
      items.push({
        page: termsContent.path,
        field: section.id,
        note: `Section pending approval: ${section.title}`,
      });
    }
    collectPendingFromTexts(
      termsContent.path,
      section.id,
      section.paragraphs,
      items,
    );
  }

  if (isPendingText(cancellationContent.lastUpdated)) {
    items.push({
      page: cancellationContent.path,
      field: "lastUpdated",
      note: BUSINESS_DECISION_REQUIRED,
    });
  }
  for (const field of cancellationContent.fields) {
    if (isPendingText(field.value)) {
      items.push({
        page: cancellationContent.path,
        field: field.id,
        note: field.label,
      });
    }
  }

  if (isPendingText(privacyContent.lastUpdated)) {
    items.push({
      page: privacyContent.path,
      field: "lastUpdated",
      note: BUSINESS_DECISION_REQUIRED,
    });
  }
  for (const section of privacyContent.sections) {
    if (section.pendingApproval) {
      items.push({
        page: privacyContent.path,
        field: section.id,
        note: `Section pending approval: ${section.title}`,
      });
    }
    collectPendingFromTexts(
      privacyContent.path,
      section.id,
      section.paragraphs,
      items,
    );
  }

  if (isPendingText(contactContent.lastUpdated)) {
    items.push({
      page: contactContent.path,
      field: "lastUpdated",
      note: BUSINESS_DECISION_REQUIRED,
    });
  }
  for (const detail of contactContent.details) {
    if (isPendingText(detail.value)) {
      items.push({
        page: contactContent.path,
        field: detail.id,
        note: detail.label,
      });
    }
  }

  return items;
}
