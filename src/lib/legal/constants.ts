/**
 * Sentinel for unresolved business/legal decisions.
 * Never render this string to customers — omit the field or section instead.
 */
export const BUSINESS_DECISION_REQUIRED = "BUSINESS_DECISION_REQUIRED" as const;

export type BusinessDecisionRequired = typeof BUSINESS_DECISION_REQUIRED;

/**
 * When true, pending sections render with an internal draft banner.
 * Keep false for production builds.
 */
export const legalShowPendingSections = false;
