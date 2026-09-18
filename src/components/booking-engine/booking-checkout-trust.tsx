import Link from "next/link";

import {
  bookingCheckoutCopy,
  bookingCheckoutLinks,
  bookingContactPath,
} from "@/lib/booking/booking-config";
import { businessIdentity } from "@/lib/legal/business-identity";

export function BookingCheckoutTrust() {
  return (
    <footer className="book-checkout-trust mx-auto max-w-3xl space-y-6 pt-2 text-center">
      <p className="text-sm leading-6 text-[var(--book-muted)]">
        {bookingCheckoutCopy.supportLine}{" "}
        <Link
          href={bookingContactPath}
          className="book-text-link underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--w2-focus-ring)]"
        >
          {bookingCheckoutCopy.supportLinkLabel}
        </Link>
      </p>

      <nav
        aria-label="Booking policies"
        className="border-t border-[var(--book-line)] pt-6"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] tracking-wide text-[var(--book-muted)]">
          {bookingCheckoutLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition hover:text-[var(--book-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-5 max-w-md text-[12px] leading-5 text-[var(--book-muted)]">
          {businessIdentity.agentStatus}
        </p>
      </nav>
    </footer>
  );
}
