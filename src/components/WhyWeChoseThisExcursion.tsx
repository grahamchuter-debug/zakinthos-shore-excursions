import type { WhyWeChoseThisExcursion } from "@/data/why-we-chose-types";

type WhyWeChoseProps = {
  content: WhyWeChoseThisExcursion;
  /** Optional destination-neutral heading override */
  heading?: string;
};

/**
 * World 2.0 reusable editorial block for excursion pages.
 * Explains the recommendation like a local concierge — not a product brochure.
 */
export function WhyWeChoseThisExcursion({
  content,
  heading = "Why We Chose This Excursion",
}: WhyWeChoseProps) {
  const points = [
    { label: "Why we recommend it", body: content.whyRecommended },
    { label: "Who it suits", body: content.whoItSuits },
    { label: "What makes it special", body: content.whatMakesItSpecial },
    { label: "Why it works for cruise passengers", body: content.cruiseFit },
    { label: "The experience you leave with", body: content.theExperience },
  ] as const;

  return (
    <section
      className="mt-12 rounded-[1.75rem] border border-coastal-100 bg-gradient-to-br from-coastal-50/90 via-white to-sandstone-300/20 p-6 sm:p-8 lg:p-10"
      aria-labelledby="why-we-chose-heading"
    >
      <p className="section-eyebrow text-coastal-700">Editor’s note</p>
      <h2
        id="why-we-chose-heading"
        className="mt-2 font-display text-2xl font-semibold text-gray-900 sm:text-3xl"
      >
        {heading}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-700 sm:text-lg">
        {content.lead}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {points.map((point) => (
          <article key={point.label} className="min-w-0">
            <h3 className="font-display text-lg font-semibold text-coastal-900">
              {point.label}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[0.95rem]">
              {point.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
