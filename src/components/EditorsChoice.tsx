import {
  EDITORS_CHOICE_LABEL,
  EDITORS_CHOICE_TAGLINE,
} from "@/data/editors-choice";
import { EditorsChoiceBadge } from "@/components/EditorsChoiceBadge";

type EditorsChoiceProps = {
  /** Override platform tagline for a destination-specific nuance */
  tagline?: string;
  /** Compact inline strip vs full editorial callout */
  variant?: "callout" | "inline";
  className?: string;
};

/**
 * World 2.0 Editor's Choice callout for excursion pages and hero products.
 * Configuration-driven: only mount when `excursion.editorChoice === true`.
 */
export function EditorsChoice({
  tagline = EDITORS_CHOICE_TAGLINE,
  variant = "callout",
  className = "",
}: EditorsChoiceProps) {
  if (variant === "inline") {
    return (
      <div className={`editors-choice-inline ${className}`.trim()}>
        <EditorsChoiceBadge showTagline />
      </div>
    );
  }

  return (
    <aside
      className={`editors-choice-callout ${className}`.trim()}
      aria-labelledby="editors-choice-heading"
    >
      <EditorsChoiceBadge />
      <h2 id="editors-choice-heading" className="editors-choice-callout-title">
        {EDITORS_CHOICE_LABEL}
      </h2>
      <p className="editors-choice-callout-body">{tagline}</p>
    </aside>
  );
}

/** Guard helper — destinations should prefer this over hard-coded slug checks. */
export function hasEditorsChoice(
  item: { editorChoice?: boolean } | null | undefined,
): boolean {
  return item?.editorChoice === true;
}
