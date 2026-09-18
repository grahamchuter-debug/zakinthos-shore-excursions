import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { ChooseYourDay } from "@/components/ChooseYourDay";
import { SpiritOfPlace } from "@/components/SpiritOfPlace";
import { WowCollectionFeature } from "@/components/WowCollectionFeature";
import { SignatureExperienceFeature } from "@/components/SignatureExperienceFeature";
import { EditorsCollection } from "@/components/EditorsCollection";
import { HonestAdvice } from "@/components/HonestAdvice";
import { EditorialPromise } from "@/components/EditorialPromise";
import { ExperienceCards } from "@/components/ExperienceCards";
import { FAQSection } from "@/components/FAQSection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, travelGuideSchema } from "@/lib/schema";
import {
  coreSections,
  featuredExperienceCards,
  featuredSectionCopy,
  getHomepageFaqs,
  homepageDestinationLine,
  homepageHero,
  homepageSubheading,
  homepageTagline,
} from "@/data/homepage";
import { getFeaturedExcursions, getEditorChoiceExcursion } from "@/data/excursions";
import { siteImages, getExcursionImage } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { PreloadImage } from "@/components/PreloadImage";
import { DestinationQuickLinks } from "@/components/DestinationQuickLinks";
import { CruiseHeroTrust } from "@/components/CruiseHeroTrust";
import { YourDayAshore } from "@/components/YourDayAshore";
import { CruisePassengerRatings } from "@/components/CruisePassengerRatings";
import { EditorsChoice } from "@/components/EditorsChoice";
import { formatMajorMoney, SITE_CURRENCY } from "@/lib/commerce/currency";

export const metadata = buildMetadata({
  title: "Zakynthos Shore Excursions | The Emerald Jewel of the Ionian",
  description:
    "Discover Zakynthos — Navagio viewpoints, Blue Caves, loggerhead turtles, Zakynthos Town harbour life and carefully selected shore excursions designed around your cruise schedule.",
  path: "/",
  keywords: [
    "Zakynthos Shore Excursions",
    "Shore Excursions from Zakynthos",
    "Zakynthos Cruise Excursions",
    "Zakynthos Cruise Port Guide",
    "Navagio Shipwreck Beach",
    "Blue Caves Zakynthos",
    "Zakinthos shore excursions",
  ],
});

const SITE_DESCRIPTION =
  "The Emerald Jewel of the Ionian — carefully selected Zakynthos shore excursions, independent cruise advice and experiences across the Ionian Sea, traditional island interior villages and the Ionian Islands.";

export default function HomePage() {
  const faqs = getHomepageFaqs();
  const featured = getFeaturedExcursions().slice(0, 5);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          faqSchema(faqs),
          travelGuideSchema({
            title: "Zakynthos — The Emerald Jewel of the Ionian",
            description: SITE_DESCRIPTION,
            path: "/",
          }),
        ]}
      />

      <PreloadImage base={siteImages.hero.base} role="hero" />

      <section className="home-hero">
        <ResponsiveImage
          image={siteImages.hero}
          role="hero"
          priority
          className="absolute inset-0 block h-full w-full"
          imgClassName="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container-wide relative z-10 px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow mb-2 text-coastal-100 animate-fade-up">
            {homepageHero.eyebrow}
          </p>
          <h1 className="home-hero-heading animate-fade-up-delay">{homepageTagline}</h1>
          <CruiseHeroTrust />
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg animate-fade-up-delay">
            {homepageSubheading}
          </p>
          <p className="mt-3 text-sm tracking-wide text-white/75 animate-fade-up-delay">
            {homepageDestinationLine}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up-delay-2">
            <Link href={homepageHero.primaryCta.href} className="btn-accent">
              {homepageHero.primaryCta.label}
            </Link>
            <Link
              href={homepageHero.secondaryCta.href}
              className="btn-secondary bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              {homepageHero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <EditorialPromise />
      <YourDayAshore />
      <CruisePassengerRatings />
      <ExperienceCards
        cards={featuredExperienceCards}
        eyebrow="Decide first"
        subtitle="Choose how you want to experience Zakynthos — walk the historic waterfront independently, discover olive-grove villages’s traditional villages, or journey to Navagio when your cruise schedule allows."
      />
      <ChooseYourDay />
      <SpiritOfPlace />
      {getEditorChoiceExcursion() ? (
        <section className="section-padding border-b border-coastal-100 bg-white">
          <div className="container-wide max-w-3xl">
            <EditorsChoice
              tagline="Private Journey to Island Highlights by 4x4 — our strongest organised cruise day when your hours ashore support Greece’s most spectacular island landmark landscape."
            />
            <p className="mt-6 text-sm text-gray-600">
              <Link
                href="/shore-excursions/panoramic-island-views-4x4"
                className="font-semibold text-maple-600 hover:text-maple-700"
              >
                Read why we chose Navagio →
              </Link>
            </p>
          </div>
        </section>
      ) : null}
      <WowCollectionFeature />
      <SignatureExperienceFeature />
      <EditorsCollection />
      <HonestAdvice />

      <section className="section-padding bg-coastal-900 text-white">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="section-eyebrow text-coastal-200">{featuredSectionCopy.eyebrow}</p>
            <h2 className="section-title mt-2 text-white">{featuredSectionCopy.title}</h2>
            <p className="section-subtitle text-coastal-100">{featuredSectionCopy.subtitle}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((excursion) => {
              const image = getExcursionImage(excursion.slug);
              return (
                <Link
                  key={excursion.slug}
                  href={`/shore-excursions/${excursion.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ResponsiveImage
                      image={image}
                      role="card"
                      imgClassName="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-coastal-200">
                      {excursion.category}
                      {(excursion.priceAmount ?? excursion.priceEur) != null
                        ? ` · ${formatMajorMoney(excursion.priceAmount ?? excursion.priceEur!, excursion.priceCurrency ?? SITE_CURRENCY)}`
                        : ""}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-white">
                      {excursion.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-coastal-100">
                      {excursion.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-8">
            <Link href="/shore-excursions" className="btn-accent">
              View all shore excursions
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Plan with confidence</p>
            <h2 className="section-title mt-2">Everything you need for Zakynthos</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {coreSections.map((section) => (
              <Link key={section.slug} href={section.href} className="nav-card">
                <p className="text-xs font-semibold uppercase tracking-wider text-coastal-600">
                  {section.number}
                </p>
                <h3 className="mt-3 font-display text-xl font-bold text-gray-900">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{section.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-maple-600">
                  {section.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DestinationQuickLinks />
      <FAQSection faqs={faqs} title="Zakynthos shore excursion FAQs" />
    </>
  );
}
