import { legalShowPendingSections } from "@/lib/legal/constants";
import type {
  CancellationField,
  CancellationPolicyContent,
  ContactDetail,
  ContactPageContent,
  LegalPageContent,
  LegalSection,
  LegalText,
} from "@/lib/legal/types";
import { isResolvedText } from "@/lib/legal/types";

export function resolveParagraphs(paragraphs: readonly LegalText[]): string[] {
  return paragraphs.filter(isResolvedText);
}

export function resolveSection(
  section: LegalSection,
): { id: string; title: string; paragraphs: string[] } | null {
  if (section.pendingApproval && !legalShowPendingSections) {
    return null;
  }
  const paragraphs = resolveParagraphs(section.paragraphs);
  if (paragraphs.length === 0) return null;
  return { id: section.id, title: section.title, paragraphs };
}

export function resolveLegalPage(page: LegalPageContent) {
  const sections = page.sections
    .map(resolveSection)
    .filter((section): section is NonNullable<typeof section> => Boolean(section));

  return {
    path: page.path,
    title: page.title,
    metaDescription: page.metaDescription,
    lastUpdated: isResolvedText(page.lastUpdated) ? page.lastUpdated : null,
    lead: page.lead,
    sections,
  };
}

export function resolveCancellationFields(
  fields: readonly CancellationField[],
): { id: string; label: string; value: string }[] {
  return fields
    .filter((field) => isResolvedText(field.value))
    .map((field) => ({
      id: field.id,
      label: field.label,
      value: field.value as string,
    }));
}

export function resolveCancellationPage(page: CancellationPolicyContent) {
  return {
    path: page.path,
    title: page.title,
    metaDescription: page.metaDescription,
    lastUpdated: isResolvedText(page.lastUpdated) ? page.lastUpdated : null,
    lead: page.lead,
    fields: resolveCancellationFields(page.fields),
    closingParagraphs: resolveParagraphs(page.closingParagraphs),
  };
}

export function resolveContactDetails(
  details: readonly ContactDetail[],
): { id: string; label: string; value: string; href?: string }[] {
  return details
    .filter((detail) => isResolvedText(detail.value))
    .map((detail) => ({
      id: detail.id,
      label: detail.label,
      value: detail.value as string,
      href: detail.href && isResolvedText(detail.href) ? detail.href : undefined,
    }));
}

export function resolveContactPage(page: ContactPageContent) {
  return {
    path: page.path,
    title: page.title,
    metaDescription: page.metaDescription,
    lastUpdated: isResolvedText(page.lastUpdated) ? page.lastUpdated : null,
    lead: page.lead,
    details: resolveContactDetails(page.details),
    closingParagraphs: resolveParagraphs(page.closingParagraphs),
  };
}

export function formatLastUpdated(isoDate: string): string {
  const parsed = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}
