import Link from "next/link";

import { useBookingTour } from "@/components/booking-engine/booking-tour-context";
import { siteConfig } from "@/lib/site-config";

type BookingCheckoutHeaderProps = {
  tourPath?: string;
  tourLabel?: string;
  /**
   * Opening scene: brand wordmark + return to tour.
   * Booking flow: brand + secure cue + return to tour.
   */
  mode?: "scene" | "booking";
};

export function BookingCheckoutHeader({
  tourPath,
  tourLabel,
  mode = "booking",
}: BookingCheckoutHeaderProps) {
  const tour = useBookingTour();
  const resolvedPath = tourPath ?? tour.path;
  const resolvedLabel = tourLabel ?? tour.backLabel;
  const isScene = mode === "scene";

  return (
    <header
      className={
        isScene
          ? "pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-[var(--book-ink)]/45 via-[var(--book-ink)]/10 to-transparent"
          : "border-b border-[var(--book-line)]/80 bg-[var(--book-surface)]/85 backdrop-blur-xl"
      }
    >
      <div className="book-shell flex items-center justify-between gap-5 py-5 sm:py-6">
        <Link
          href="/"
          className={[
            "book-brand-mark pointer-events-auto min-w-0 truncate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            isScene
              ? "book-display text-[1.15rem] font-medium leading-tight tracking-[-0.01em] text-white drop-shadow-[0_1px_12px_rgba(12,26,36,0.45)] focus-visible:outline-white sm:text-[1.35rem]"
              : "text-[14px] font-medium tracking-[0.02em] text-[var(--book-ink)] focus-visible:outline-[var(--book-sea)] sm:text-[15px]",
          ].join(" ")}
        >
          {siteConfig.name}
        </Link>

        <div className="pointer-events-auto flex shrink-0 items-center gap-4 sm:gap-6">
          {!isScene ? (
            <p className="hidden items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-[var(--book-muted)] uppercase sm:flex">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--book-success)]"
              />
              Secure booking
            </p>
          ) : null}
          <Link
            href={resolvedPath}
            className={[
              "max-w-[14rem] truncate text-[13px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:max-w-none sm:text-sm",
              isScene
                ? "text-white/85 hover:text-white focus-visible:outline-white"
                : "text-[var(--book-muted)] hover:text-[var(--book-ink)] focus-visible:outline-[var(--book-sea)]",
            ].join(" ")}
          >
            {resolvedLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
