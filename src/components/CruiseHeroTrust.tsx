import { cruisePositioning, getCruiseTrustMessage } from "@/data/cruise-positioning";

function ShipAnchorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="2.25" />
      <path d="M12 7.25v11.5" />
      <path d="M8 12h8" />
      <path d="M6.5 18.5c1.8 1.4 3.6 2.1 5.5 2.1s3.7-.7 5.5-2.1" />
      <path d="M6.5 18.5V15" />
      <path d="M17.5 18.5V15" />
    </svg>
  );
}

/**
 * Subtle cruise trust line for the homepage hero.
 * Copy is driven by `cruisePositioning` for future message swaps.
 */
export function CruiseHeroTrust() {
  if (!cruisePositioning.enabled) return null;

  const message = getCruiseTrustMessage();

  return (
    <div className="mt-4 max-w-2xl animate-fade-up-delay">
      {cruisePositioning.eyebrow ? (
        <p className="mb-1.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-maple-300/95 sm:text-xs">
          {cruisePositioning.eyebrow}
        </p>
      ) : null}
      <p className="flex items-start gap-2.5 text-sm leading-snug text-white/88 sm:text-[0.95rem] sm:leading-relaxed">
        <ShipAnchorIcon className="mt-0.5 h-4 w-4 shrink-0 text-maple-300/90 sm:mt-1 sm:h-[1.05rem] sm:w-[1.05rem]" />
        <span>{message}</span>
      </p>
    </div>
  );
}
