import type { BusinessDecisionRequired } from "@/lib/legal/constants";
import { BUSINESS_DECISION_REQUIRED } from "@/lib/legal/constants";

export type LegalText = string | BusinessDecisionRequired;

export type LegalSection = {
  id: string;
  title: string;
  /** Paragraphs; any BUSINESS_DECISION_REQUIRED entry is omitted from customers. */
  paragraphs: readonly LegalText[];
  /**
   * When true, the whole section is withheld until business/legal approval
   * (unless legalShowPendingSections is enabled for local review).
   */
  pendingApproval?: boolean;
};

export type LegalPageContent = {
  path: string;
  title: string;
  metaDescription: string;
  /** ISO date string YYYY-MM-DD — shown as “Last updated”. */
  lastUpdated: string | BusinessDecisionRequired;
  lead: string;
  sections: readonly LegalSection[];
};

export type CancellationField = {
  id: string;
  label: string;
  /** Customer-facing explanation once set; omit while pending. */
  value: LegalText;
};

export type CancellationPolicyContent = {
  path: string;
  title: string;
  metaDescription: string;
  lastUpdated: string | BusinessDecisionRequired;
  lead: string;
  fields: readonly CancellationField[];
  closingParagraphs: readonly LegalText[];
};

export type ContactDetail = {
  id: string;
  label: string;
  value: LegalText;
  href?: LegalText;
};

export type ContactPageContent = {
  path: string;
  title: string;
  metaDescription: string;
  lastUpdated: string | BusinessDecisionRequired;
  lead: string;
  details: readonly ContactDetail[];
  closingParagraphs: readonly LegalText[];
};

export function isPendingText(value: LegalText): value is BusinessDecisionRequired {
  return value === BUSINESS_DECISION_REQUIRED;
}

export function isResolvedText(value: LegalText): value is string {
  return typeof value === "string" && value !== BUSINESS_DECISION_REQUIRED;
}
