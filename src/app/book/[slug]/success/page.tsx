import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookingTourProvider } from "@/components/booking-engine/booking-tour-context";
import { BookingSuccessClient } from "@/components/booking-engine/booking-success-client";
import { getAllBookableSlugs, getBookableProduct } from "@/data/bookable-products";
import { getBookingTourView } from "@/lib/booking/booking-config";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  const slugs = getAllBookableSlugs();
  if (slugs.length === 0) return [{ slug: "unavailable" }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getBookableProduct(slug);
  if (!product) {
    return {
      ...buildMetadata({
        title: "Booking Confirmation Not Available",
        description:
          "Zakynthos shore excursion booking confirmation pages activate when online checkout is live. Contact us if you need help with an existing enquiry.",
        path: `/book/${slug}/success`,
        noindex: true,
      }),
      title: { absolute: "Booking Confirmation Not Available | Zakynthos Shore Excursions" },
    };
  }
  return buildMetadata({
    title: `Booking Confirmed — ${product.name}`,
    description: `Your ${product.experienceName} booking confirmation from Zakynthos Shore Excursions.`,
    path: product.successPath,
  });
}

export default async function BookSuccessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "unavailable" || !getBookableProduct(slug)) {
    return (
      <main className="flex-1">
        <section className="container-wide section-padding max-w-2xl">
          <p className="section-eyebrow">Booking</p>
          <h1 className="section-title mt-2">Confirmation is not available yet</h1>
          <p className="mt-4 text-base leading-relaxed text-gray-700">
            Online checkout for Zakynthos shore excursions is not live. When booking opens, confirmation
            pages will appear here after payment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/enquire" className="btn-accent">
              Contact concierge
            </a>
            <a href="/shore-excursions" className="btn-secondary">
              Browse excursions
            </a>
          </div>
        </section>
      </main>
    );
  }

  const tour = getBookingTourView(slug);
  if (!tour) notFound();

  return (
    <BookingTourProvider tour={tour}>
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="book-shell py-24 text-center text-[var(--book-muted)]">
              Confirming your payment…
            </div>
          }
        >
          <BookingSuccessClient />
        </Suspense>
      </main>
    </BookingTourProvider>
  );
}
