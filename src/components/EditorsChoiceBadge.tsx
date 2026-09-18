import {
  EDITORS_CHOICE_LABEL,
  EDITORS_CHOICE_SHORT,
} from "@/data/editors-choice";

export type EditorsChoiceBadgeVariant = "default" | "overlay" | "compact";

type EditorsChoiceBadgeProps = {
  /** Visual placement context */
  variant?: EditorsChoiceBadgeVariant;
  /** Show the short supporting line beside/under the label */
  showTagline?: boolean;
  className?: string;
};

/**
 * Reusable World 2.0 Editor's Choice badge.
 * Render only when an excursion has `editorChoice: true`.
 */
export function EditorsChoiceBadge({
  variant = "default",
  showTagline = false,
  className = "",
}: EditorsChoiceBadgeProps) {
  const badgeClass =
    variant === "overlay"
      ? "badge-editors-choice badge-editors-choice--overlay"
      : variant === "compact"
        ? "badge-editors-choice badge-editors-choice--compact"
        : "badge-editors-choice";

  return (
    <span
      className={`editors-choice-badge-wrap ${className}`.trim()}
      role="status"
      aria-label={`${EDITORS_CHOICE_LABEL}. ${EDITORS_CHOICE_SHORT}`}
    >
      <span className={badgeClass}>
        <span className="badge-editors-choice-mark" aria-hidden="true" />
        {EDITORS_CHOICE_LABEL}
      </span>
      {showTagline ? (
        <span className="editors-choice-badge-tagline">{EDITORS_CHOICE_SHORT}</span>
      ) : null}
    </span>
  );
}
