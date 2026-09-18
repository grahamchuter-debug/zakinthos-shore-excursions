import Link from "next/link";
import { notFound } from "next/navigation";
import { excursionPageMetadata } from "@/lib/seo";
import { PhotoHeroBand } from "@/components/PhotoHeroBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQSection } from "@/components/FAQSection";
import { PlanningLinks } from "@/components/PlanningLinks";
import { WhyWeChoseThisExcursion } from "@/components/WhyWeChoseThisExcursion";
import { EditorsChoice, hasEditorsChoice } from "@/components/EditorsChoice";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, articleSchema } from "@/lib/schema";
import { getExcursionBySlug, getAllExcursionSlugs, excursions } from "@/data/excursions";
import { getExcursionImage } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { formatMajorMoney, SITE_CURRENCY } from "@/lib/commerce/currency";
import {
  bookingPrimaryCta,
  bookingStatusLabel,
  resolveBookingStatus,
  shouldShowPublicPrice,
} from "@/lib/booking-status";

function excursionPriceLabel(e: {
  priceAmount?: number;
  priceEur?: number;
  priceCurrency?: string;
  bookingStatus?: import("@/lib/booking-status").BookingStatus;
  bookable?: boolean;
}) {
  if (!shouldShowPublicPrice(e)) return null;
  const amount = e.priceAmount ?? e.priceEur;
  if (amount == null) return null;
  const currency = (e.priceCurrency as typeof SITE_CURRENCY | undefined) ?? SITE_CURRENCY;
  return formatMajorMoney(amount, currency);
}
export function generateStaticParams() {
  return getAllExcursionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getExcursionBySlug(slug);
  if (!e) return {};
  return excursionPageMetadata(slug, e.seoTitle, e.metaDescription);
}

export default async function ExcursionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getExcursionBySlug(slug);
  if (!e) notFound();
  const image = getExcursionImage(slug);
  const related = e.relatedExcursionSlugs.map((s) => excursions.find((x) => x.slug === s)).filter(Boolean);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Shore Excursions", path: "/shore-excursions" },
    { name: e.title, path: `/shore-excursions/${slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          faqSchema(e.faqs),
          articleSchema({ title: e.seoTitle, description: e.metaDescription, path: `/shore-excursions/${slug}`, image: image.src }),
        ]}
      />
      <PhotoHeroBand image={image} eyebrow={e.category} title={e.title} subtitle={e.tagline} compact />

      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />

          {hasEditorsChoice(e) ? <EditorsChoice /> : null}

          <div className="mb-8 flex flex-wrap gap-2">
            {hasEditorsChoice(e) ? (
              <span className="sr-only">Editor&apos;s Choice excursion</span>
            ) : null}
            <span className="pill">Duration: {e.duration}</span>
            <span className="pill">Pace: {e.pace}</span>
            {e.walkingLevel ? <span className="pill">Walking: {e.walkingLevel}</span> : null}
            <span className="pill">{bookingStatusLabel(resolveBookingStatus(e))}</span>
            {excursionPriceLabel(e) ? (
              <span className="pill">From {excursionPriceLabel(e)} per guest</span>
            ) : null}
            <span className="pill">Best for: {e.bestFor}</span>
          </div>

          {e.cruiseSuitability ? (
            <p className="mb-6 rounded-2xl bg-coastal-50 px-4 py-3 text-sm text-coastal-800 ring-1 ring-coastal-100">
              Cruise suitability: {e.cruiseSuitability}
            </p>
          ) : null}

          <p className="text-lg leading-relaxed text-gray-700">{e.overview}</p>

          <div className="prose-body">
            {e.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {e.itinerary && e.itinerary.length > 0 ? (
            <div className="mt-10">
              <h2 className="section-title text-2xl mb-4">Itinerary</h2>
              <ol className="space-y-4">
                {e.itinerary.map((stop, index) => (
                  <li key={stop.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-coastal-600">
                      Stop {index + 1}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-gray-900">{stop.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{stop.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="card-feature">
              <h2 className="font-display text-xl font-bold text-gray-900">Highlights</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {e.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
            <div className="card-feature">
              <h2 className="font-display text-xl font-bold text-gray-900">Included</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {e.included.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
          </div>

          {e.notIncluded && e.notIncluded.length > 0 ? (
            <div className="mt-6 card-feature">
              <h2 className="font-display text-xl font-bold text-gray-900">Not included</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {e.notIncluded.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
          ) : null}

          {e.returnGuarantee ? (
            <div className="mt-8 card-accent">
              <h2 className="font-display text-xl font-bold text-gray-900">Return to ship guarantee</h2>
              <p className="mt-3 text-gray-700">{e.returnGuarantee}</p>
            </div>
          ) : null}

          <div className="mt-8 card-accent">
            <h2 className="font-display text-xl font-bold text-gray-900">Getting there from the cruise port</h2>
            <p className="mt-3 text-gray-700">{e.portLogistics}</p>
          </div>

          <div className="mt-8">
            <h2 className="section-title text-2xl mb-4">Tips for cruise passengers</h2>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              {e.tips.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>

          {e.whyWeChose ? <WhyWeChoseThisExcursion content={e.whyWeChose} /> : null}

          <div className="mt-10 flex flex-wrap gap-3">
            {(() => {
              const cta = bookingPrimaryCta(e);
              if (cta.kind === "book") {
                return (
                  <Link href={cta.href} className="btn-primary">
                    {cta.label}
                    {excursionPriceLabel(e) ? ` — ${excursionPriceLabel(e)}` : ""}
                  </Link>
                );
              }
              return (
                <Link href={cta.href} className="btn-primary">
                  {cta.label}
                </Link>
              );
            })()}
            <Link href="/cruise-planner" className="btn-secondary">Build my cruise plan</Link>
            <Link href="/enquire" className="btn-secondary">Enquire about this excursion</Link>
          </div>

          <FAQSection faqs={e.faqs} title="Excursion FAQs" />

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="section-title text-2xl mb-6">Related excursions</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {related.map((item) =>
                  item ? (
                    <Link
                      key={item.slug}
                      href={`/shore-excursions/${item.slug}`}
                      className="card-editorial overflow-hidden"
                    >
                      <div className="relative aspect-[4/3]">
                        <ResponsiveImage
                          image={getExcursionImage(item.slug)}
                          role="card"
                          imgClassName="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-display text-lg font-semibold text-gray-900">{item.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{item.duration}</p>
                      </div>
                    </Link>
                  ) : null,
                )}
              </div>
            </div>
          )}

          <PlanningLinks />
        </div>
      </section>
    </>
  );
}
