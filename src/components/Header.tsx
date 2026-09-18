"use client";

import Link from "next/link";
import { useState } from "react";
import { DestinationLogo } from "@/components/DestinationLogo";
import { destinationConfig } from "@/config/destination";
import { destinationIdentity } from "@/data/destination-identity";

const navItems = destinationConfig.nav;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-coastal-100 bg-white/95 backdrop-blur-sm">
      <div className="container-wide flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8">
        <Link
          href="/"
          className="group min-w-0 shrink rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-coastal-500 focus-visible:ring-offset-2"
          aria-label={`${destinationIdentity.accessibleName} — home`}
        >
          {/* Desktop / large tablet: full wordmark with strapline */}
          <span className="hidden lg:inline-flex">
            <DestinationLogo variant="full" decorative />
          </span>
          {/* Compact tablet / mobile: destination + descriptor only */}
          <span className="inline-flex lg:hidden">
            <DestinationLogo variant="compact" decorative />
          </span>
        </Link>
        <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-coastal-50 hover:text-coastal-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden xl:block shrink-0">
          <Link href="/enquire" className="btn-accent text-sm">
            Enquire
          </Link>
        </div>
        <button
          type="button"
          className="xl:hidden shrink-0 rounded-lg p-2 text-gray-700 hover:bg-coastal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-coastal-500"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="xl:hidden border-t border-coastal-100 bg-white px-4 py-4" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-coastal-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/enquire"
              className="rounded-lg px-4 py-3 text-sm font-semibold text-maple-600 hover:bg-coastal-50"
              onClick={() => setOpen(false)}
            >
              Enquire
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
