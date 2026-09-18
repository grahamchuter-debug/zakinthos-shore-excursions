import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookingTourProvider } from "@/components/booking-engine/booking-tour-context";
import { BookingEngine } from "@/components/booking-engine/booking-engine";
import { getAllBookableSlugs, getBookableProduct } from "@/data/bookable-products";
import { getBookingTourView } from "@/lib/booking/booking-config";
import { buildBookingShipsByDate } from "@/lib/booking/booking-ships";
import { formatBookingMoney } from "@/lib/booking/booking-format";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  const slugs = getAllBookableSlugs();
  // `output: "export"` requires at least one param for this dynamic route.
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
        title: "Online Booking Not Yet Open",
        description:
          "Zakynthos shore excursion online booking opens once EUR selling prices and fulfilment routes are verified. Enquire for guidance in the meantime.",
        path: `/book/${slug}`,
        noindex: true,
      }),
      title: { absolute: "Online Booking Not Yet Open | Zakynthos Shore Excursions" },
    };
  }
  return buildMetadata({
    title: `Book ${product.name}`,
    description: `Book ${product.experienceName} from Zakynthos. ${formatBookingMoney(product.priceAmount)} per guest. Secure online booking with return-to-ship planning.`,
    path: product.bookingPath,
  });
}

export default async function BookTourPage({
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
          <h1 className="section-title mt-2">Online booking is not open yet</h1>
          <p className="mt-4 text-base leading-relaxed text-gray-700">
            Zakynthos shore excursions will become bookable online once EUR selling prices and
            fulfilment routes are verified. Until then, browse our editorial guides and enquire if
            you need help planning your day ashore.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/shore-excursions" className="btn-accent">
              Browse excursions
            </a>
            <a href="/enquire" className="btn-secondary">
              Contact concierge
            </a>
          </div>
        </section>
      </main>
    );
  }

  const tour = getBookingTourView(slug);
  if (!tour) notFound();

  const shipsByDate = buildBookingShipsByDate();
  const firstHero = tour.heroGallery[0];

  return (
    <>
      {firstHero ? (
        <link
          rel="preload"
          as="image"
          href={firstHero.fallbackSrc}
          imageSrcSet={firstHero.webpSrcSet}
          imageSizes="100vw"
        />
      ) : null}
      <BookingTourProvider tour={tour}>
        <main className="flex-1">
          <BookingEngine shipsByDate={shipsByDate} />
        </main>
      </BookingTourProvider>
    </>
  );
}
