"use client";

import { bookingSteps, type BookingStepId } from "@/lib/booking/booking-config";

type BookingProgressProps = {
  current: BookingStepId;
  /** Steps the customer may jump to (completed / reachable). */
  canNavigateTo?: (step: BookingStepId) => boolean;
  onNavigate?: (step: BookingStepId) => void;
};

const FLOW_STEPS = bookingSteps.filter(
  (step) => step.id !== "tour" && step.id !== "confirmed",
);

/**
 * Restrained progress: numbered step labels. Completed steps are clickable
 * for editing; future steps stay inert until required info exists.
 */
export function BookingProgress({
  current,
  canNavigateTo,
  onNavigate,
}: BookingProgressProps) {
  if (current === "confirmed") {
    return (
      <p className="text-center text-xs font-medium tracking-[0.16em] uppercase text-[var(--book-success)]">
        Confirmed
      </p>
    );
  }

  const currentIndex = FLOW_STEPS.findIndex((step) => step.id === current);
  const stepNumber = currentIndex + 1;
  const total = FLOW_STEPS.length;
  const currentLabel = FLOW_STEPS[currentIndex]?.label ?? "";
  const progressPercent = total > 0 ? (stepNumber / total) * 100 : 0;

  return (
    <div className="w-full">
      <div
        className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--book-line)]"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={stepNumber}
        aria-valuetext={`Step ${stepNumber} of ${total}: ${currentLabel}`}
      >
        <div
          className="book-progress-fill h-full rounded-full bg-[var(--w2-primary)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <nav
        className="mt-3"
        aria-label="Booking steps"
      >
        <ol className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 text-[11px] font-medium tracking-[0.12em] text-[var(--book-muted)] uppercase">
          {FLOW_STEPS.map((step, index) => {
            const isCurrent = step.id === current;
            const reachable = Boolean(canNavigateTo?.(step.id));
            const clickable =
              reachable && !isCurrent && typeof onNavigate === "function";
            const label = `${index + 1}.${step.label}`;

            if (clickable) {
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(step.id)}
                    className="book-btn rounded-sm text-[var(--book-sea)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--w2-focus-ring)]"
                  >
                    {label}
                  </button>
                </li>
              );
            }

            return (
              <li
                key={step.id}
                className={
                  isCurrent
                    ? "text-[var(--book-ink)]"
                    : reachable
                      ? "text-[var(--book-muted)]"
                      : "text-[var(--book-line)]"
                }
                aria-current={isCurrent ? "step" : undefined}
              >
                {label}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
