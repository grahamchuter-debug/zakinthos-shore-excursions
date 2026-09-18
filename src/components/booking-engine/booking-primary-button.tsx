"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type BookingPrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "onDark";
};

/**
 * Full-width on mobile; content-sized (with a comfortable minimum) from
 * `sm:` up. Pass a width utility in `className` (e.g. `sm:w-full`) for the
 * rare case a desktop CTA should still span its container.
 */
export const BookingPrimaryButton = forwardRef<
  HTMLButtonElement,
  BookingPrimaryButtonProps
>(function BookingPrimaryButton(
  { children, variant = "primary", className = "", type = "button", ...props },
  ref,
) {
  const base =
    "book-btn w2-btn inline-flex w-full items-center justify-center rounded-full px-8 py-4 text-[15px] font-semibold tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[14rem] sm:text-base";

  const variants = {
    primary:
      "book-btn-primary w2-btn-primary bg-[var(--w2-primary)] text-white hover:bg-[var(--w2-primary-hover)] focus-visible:outline-[var(--w2-focus-ring)]",
    secondary:
      "book-btn-secondary w2-btn-secondary border border-[var(--w2-primary)] bg-white text-[var(--w2-link)] hover:border-[var(--w2-primary-hover)] hover:bg-[var(--w2-primary-soft)] focus-visible:outline-[var(--w2-focus-ring)]",
    ghost:
      "book-btn w2-btn-ghost bg-transparent text-[var(--book-muted)] hover:text-[var(--book-ink)] focus-visible:outline-[var(--w2-focus-ring)]",
    onDark:
      "book-btn-primary border border-white/55 bg-white/12 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-[var(--book-ink)] focus-visible:outline-white",
  } as const;

  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

type BookingBackLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

/**
 * Quiet wayfinding for mid-flow steps — replaces a second full-width pill
 * with an inline, text-weight action so each screen has one clear primary
 * move.
 */
export function BookingBackLink({
  children = "Back",
  className = "",
  type = "button",
  ...props
}: BookingBackLinkProps) {
  return (
    <button
      type={type}
      className={`book-back-link group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--book-muted)] outline-none hover:text-[var(--book-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--w2-focus-ring)] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className="book-back-link-arrow inline-block"
      >
        ←
      </span>
      {children}
    </button>
  );
}
