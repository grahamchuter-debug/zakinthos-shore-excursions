import { EditorsChoiceBadge } from "@/components/EditorsChoiceBadge";

interface SignatureExperienceBadgeProps {
  showEditorsChoice?: boolean;
  className?: string;
}

/**
 * @deprecated Prefer destination-specific Signature features, or Editor's Choice alone
 * via `editorChoice` on excursions. Kept for template pages still using Signature Experience.
 */
export function SignatureExperienceBadge({
  showEditorsChoice = false,
  className = "",
}: SignatureExperienceBadgeProps) {
  return (
    <span className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="badge-signature">
        <span className="badge-signature-star" aria-hidden="true">
          ★
        </span>
        Signature Experience
      </span>
      {showEditorsChoice ? <EditorsChoiceBadge variant="compact" /> : null}
    </span>
  );
}
