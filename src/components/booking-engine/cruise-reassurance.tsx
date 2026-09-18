import Link from "next/link";

import { bookingReassuranceConfig } from "@/lib/booking/booking-config";

function PromiseMark({ featured }: { featured?: boolean }) {
  return (
    <span
      className={[
        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
        featured
          ? "bg-[var(--book-sea-deep)] text-white"
          : "bg-[var(--book-mist)] text-[var(--book-sea)]",
      ].join(" ")}
      aria-hidden="true"
    >
      ✓
    </span>
  );
}

export function CruiseReassurance() {
  const { heading, supportingCopy, promises } = bookingReassuranceConfig;
  const featured = promises.find((p) => p.featured);
  const rest = promises.filter((p) => !p.featured);

  return (
    <section
      className="book-cruise-reassure book-checkout-enter space-y-8"
      aria-labelledby="cruise-reassure-heading"
    >
      <header className="mx-auto max-w-2xl space-y-4 text-center">
        <h3
          id="cruise-reassure-heading"
          className="book-display text-3xl font-medium text-[var(--book-ink)] sm:text-4xl"
        >
          {heading}
        </h3>
        <p className="text-base leading-7 text-[var(--book-muted)] sm:text-lg sm:leading-8">
          {supportingCopy}
        </p>
      </header>

      {featured ? (
        <div className="book-reassure-featured rounded-[1.5rem] border border-[var(--book-sea)]/15 bg-[linear-gradient(180deg,#f7fbfa_0%,#ffffff_100%)] px-6 py-7 sm:px-9 sm:py-8">
          <div className="flex gap-4">
            <PromiseMark featured />
            <div className="space-y-2">
              <p className="text-lg font-semibold tracking-wide text-[var(--book-ink)]">
                {featured.label}
              </p>
              {featured.detail ? (
                <p className="max-w-2xl text-[15px] leading-7 text-[var(--book-muted)]">
                  {featured.detail}
                </p>
              ) : null}
              <Link
                href="/return-to-ship-guarantee"
                className="inline-block pt-1 text-sm book-text-link underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--w2-focus-ring)]"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <ul className="grid gap-5 sm:grid-cols-2">
        {rest.map((item, index) => (
          <li
            key={item.id}
            className="book-reassure-stagger flex gap-3.5"
            style={{ animationDelay: `${0.08 + index * 0.06}s` }}
          >
            <PromiseMark />
            <div className="space-y-1">
              <p className="font-medium text-[var(--book-ink)]">{item.label}</p>
              {item.detail ? (
                <p className="text-sm leading-6 text-[var(--book-muted)]">
                  {item.detail}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
