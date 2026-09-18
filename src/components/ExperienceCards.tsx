import { ExperienceCard } from "@/components/ExperienceCard";
import type { ExperienceCard as ExperienceCardData } from "@/data/types";
import { destinationConfig } from "@/config/destination";

type ExperienceCardsProps = {
  cards: readonly ExperienceCardData[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Prefer featured layout (larger images) for the primary decision grid */
  featured?: boolean;
  className?: string;
};

/**
 * Decision-first homepage (or hub) section.
 * Include a Walk It Yourself card in homepage data when independence is recommended;
 * omit it when it is not — no separate feature flag.
 */
export function ExperienceCards({
  cards,
  eyebrow = "Experience this destination",
  title,
  subtitle = "Decide how you want to spend your hours ashore — then choose the guide or excursion that fits.",
  featured = true,
  className = "",
}: ExperienceCardsProps) {
  if (!cards.length) return null;

  const heading =
    title ?? `How would you like to experience ${destinationConfig.destination}?`;

  return (
    <section className={`section-padding bg-slate-50/80 ${className}`.trim()}>
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="section-eyebrow text-slate-600">{eyebrow}</p>
          <h2 className="section-title mt-2 text-slate-900">{heading}</h2>
          <p className="section-subtitle text-slate-600">{subtitle}</p>
        </div>

        <div
          className={`mt-10 grid gap-5 sm:grid-cols-2 ${
            cards.length >= 3 ? "lg:grid-cols-3" : ""
          }`}
        >
          {cards.map((card) => (
            <ExperienceCard key={card.slug} card={card} featured={featured} />
          ))}
        </div>
      </div>
    </section>
  );
}
