import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, articleSchema } from "@/lib/schema";
import { wowCollection, WOW_COLLECTION_PATH } from "@/data/wow-collection";
import { SIGNATURE_EXPERIENCE_PATH } from "@/data/signature-experience";
import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { PreloadImage } from "@/components/PreloadImage";

const path = WOW_COLLECTION_PATH;
const image = subjectImages.coast;

export const metadata = buildMetadata({
  title: wowCollection.seoTitle,
  description: wowCollection.metaDescription,
  path,
  image: image.src,
  imageAlt: "The Wow Collection — future exclusive shore excursions from Zakynthos",
  keywords: [
    "Wow Collection",
    "Zakynthos shore excursions",
    "small group the Ionian Islands tour",
    "exclusive cruise excursions",
  ],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "The Wow Collection", path },
];

export default function WowCollectionPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          articleSchema({
            title: wowCollection.seoTitle,
            description: wowCollection.metaDescription,
            path,
            image: image.src,
          }),
        ]}
      />

      <section className="section-signature-hero">
        <PreloadImage base={image.base} role="guide" />
        <ResponsiveImage
          image={image}
          role="guide"
          priority
          className="absolute inset-0 block h-full w-full opacity-35"
          imgClassName="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container-wide relative z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-300">
            ✨ In preparation
          </span>
          <h1 className="home-hero-heading mt-6 max-w-3xl">{wowCollection.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90 italic">
            &ldquo;{wowCollection.tagline}&rdquo;
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/enquire" className="btn-accent">
              Register interest
            </Link>
            <Link
              href="/compare/private-tour-vs-small-group"
              className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              Private vs coach
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />

          <p className="mt-8 text-lg leading-relaxed text-gray-700">{wowCollection.overview}</p>

          <h2 className="section-title mt-12 text-2xl">What makes Wow different</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {wowCollection.principles.map((p) => (
              <div key={p.title} className="card-feature">
                <span className="text-2xl" aria-hidden="true">{p.emoji}</span>
                <h3 className="mt-2 font-display font-bold text-gray-900">{p.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{p.description}</p>
              </div>
            ))}
          </div>

          <h2 className="section-title mt-12 text-2xl">Planned experiences</h2>
          <div className="mt-6 space-y-4">
            {wowCollection.plannedExperiences.map((exp) => (
              <div key={exp.title} className="placeholder-widget text-left">
                <p className="placeholder-widget-label">{exp.status === "in-preparation" ? "In preparation" : "Available"}</p>
                <h3 className="mt-2 font-display text-lg font-bold text-gray-900">{exp.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={SIGNATURE_EXPERIENCE_PATH} className="btn-secondary">
              Signature the Ionian &amp; island interior Discovery
            </Link>
            <Link href="/compare/best-shore-excursions" className="btn-secondary">
              Current recommendations
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
