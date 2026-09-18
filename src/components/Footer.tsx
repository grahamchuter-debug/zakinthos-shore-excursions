import Link from "next/link";
import { SITE } from "@/lib/site";
import { DestinationLogo } from "@/components/DestinationLogo";
import { businessIdentity } from "@/lib/legal/business-identity";
import { footerColumns } from "@/config/footer";

export function Footer() {
  const year = new Date().getFullYear();
  const { blurb, chooseTitle, choose, planTitle, plan, bookTitle, book, independenceClause } =
    footerColumns;

  return (
    <footer className="footer-depth mt-auto text-white">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="container-wide grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="inline-flex rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-maple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-coastal-900"
              aria-label={`${SITE.name} — home`}
            >
              <DestinationLogo variant="compact" tone="on-dark" decorative />
            </Link>
            <p className="mt-4 text-sm text-coastal-100/70 leading-relaxed">{blurb}</p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-white/90">{chooseTitle}</h3>
            <ul className="space-y-1.5 text-sm text-coastal-100/70">
              {choose.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-white/90">{planTitle}</h3>
            <ul className="space-y-1.5 text-sm text-coastal-100/70">
              {plan.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-white/90">{bookTitle}</h3>
            <ul className="space-y-1.5 text-sm text-coastal-100/70">
              {book.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container-wide mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs text-coastal-100/60">
          <DestinationLogo variant="mark" tone="on-dark" className="opacity-90" decorative />
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <Link href="/faq" className="hover:text-white">
            FAQ
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/cookie-policy" className="hover:text-white">
            Cookie Policy
          </Link>
          <Link href="/booking-conditions" className="hover:text-white">
            Booking Conditions
          </Link>
          <span className="ml-auto">{SITE.email}</span>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-coastal-300/75">
        &copy; {year} {SITE.name}. {businessIdentity.companyDisclosure} Independent operator —{" "}
        {independenceClause}
      </div>
    </footer>
  );
}
