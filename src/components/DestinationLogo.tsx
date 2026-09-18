import {
  destinationIdentity,
  type LogoConcept,
  type LogoTone,
  type LogoVariant,
} from "@/data/destination-identity";

type DestinationLogoProps = {
  variant?: LogoVariant;
  /** Override active concept for local review — defaults to config. */
  concept?: LogoConcept;
  tone?: LogoTone;
  className?: string;
  /** When true, omit the outer accessible name (parent Link provides it). */
  decorative?: boolean;
};

function MarkSvg({
  concept,
  tone,
  size,
}: {
  concept: LogoConcept;
  tone: LogoTone;
  size: number;
}) {
  const onDark = tone === "on-dark";
  const ink = onDark ? "#f7f2ea" : "#0d2d3a";
  const accent = onDark ? "#e8a07a" : "#bd5f3d";
  const soft = onDark ? "rgba(247,242,234,0.35)" : "#ead8b9";

  if (concept === "harbour-m") {
    // Concept B (reserved): stylised M with harbour/wave base + minimal anchor tip.
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="1" y="1" width="38" height="38" rx="10" stroke={soft} strokeWidth="1.25" />
        <path
          d="M11 28V12.5L17.2 24.2h1.1L24.5 12.5V28"
          stroke={ink}
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 31.5c3.2-2.2 6.4-3.3 11-3.3s7.8 1.1 11 3.3"
          stroke={accent}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="20" cy="8.2" r="1.35" fill={accent} />
        <path d="M20 9.6v3.2" stroke={accent} strokeWidth="1.35" strokeLinecap="round" />
      </svg>
    );
  }

  // Concept A (active): Anchor Arch — Ionian harbour mark meeting a restrained anchor.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1" y="1" width="38" height="38" rx="10" stroke={soft} strokeWidth="1.25" />
      {/* Arch */}
      <path
        d="M10 30.5V18.2c0-5.4 4.4-9.2 10-9.2s10 3.8 10 9.2v12.3"
        stroke={ink}
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      {/* Inner arch whisper */}
      <path
        d="M13.2 30.5V19c0-3.9 3.1-6.6 6.8-6.6s6.8 2.7 6.8 6.6v11.5"
        stroke={soft}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Anchor */}
      <circle cx="20" cy="16.2" r="1.45" fill={accent} />
      <path d="M20 17.7v10.2" stroke={accent} strokeWidth="1.55" strokeLinecap="round" />
      <path d="M15.6 22.2h8.8" stroke={accent} strokeWidth="1.45" strokeLinecap="round" />
      <path
        d="M14.8 29.4c1.7 1.2 3.4 1.8 5.2 1.8s3.5-.6 5.2-1.8"
        stroke={accent}
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Reusable World 2.0 destination wordmark.
 * HTML text for accessibility + inline SVG mark (no raster assets).
 *
 * Logo refinement (Zakynthos prototype): icon slightly subordinate to ZAKYNTHOS,
 * tighter icon–text gap, strapline as light tracked caps in terracotta.
 */
export function DestinationLogo({
  variant = "full",
  concept = destinationIdentity.logoConcept,
  tone = "default",
  className = "",
  decorative = false,
}: DestinationLogoProps) {
  const { destination, descriptor, strapline, accessibleName } = destinationIdentity;
  const onDark = tone === "on-dark";
  // ~12% smaller than the first prototype so ZAKYNTHOS stays dominant
  const markSize = variant === "mark" ? 32 : variant === "compact" ? 32 : 34;

  if (variant === "mark") {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        {...(decorative
          ? { "aria-hidden": true }
          : { role: "img", "aria-label": accessibleName })}
      >
        <MarkSvg concept={concept} tone={tone} size={markSize} />
      </span>
    );
  }

  const titleClass = onDark ? "text-white" : "text-coastal-900";
  const descriptorClass = onDark ? "text-white/75" : "text-coastal-700";
  const straplineClass = onDark ? "text-maple-300/90" : "text-maple-600";

  return (
    <span
      className={`inline-flex items-center gap-1.5 min-w-0 sm:gap-2 ${className}`}
      {...(decorative ? { "aria-hidden": true } : {})}
    >
      <MarkSvg concept={concept} tone={tone} size={markSize} />
      <span className="min-w-0 leading-none">
        <span
          className={`block font-display text-[1.05rem] font-semibold tracking-[0.04em] uppercase sm:text-[1.125rem] ${titleClass}`}
        >
          {destination}
        </span>
        <span
          className={`mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.14em] sm:text-[0.68rem] ${descriptorClass}`}
        >
          {descriptor}
        </span>
        {variant === "full" && strapline ? (
          <span
            className={`mt-1 block text-[0.625rem] font-medium uppercase tracking-[0.12em] sm:text-[0.65rem] ${straplineClass}`}
            style={{ letterSpacing: "0.12em" }}
          >
            {strapline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
