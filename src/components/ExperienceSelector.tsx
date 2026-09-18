import { ExperienceCard } from "@/components/ExperienceCard";
import { experienceCards } from "@/data/homepage";
import { destinationConfig } from "@/config/destination";

export function ExperienceSelector() {
  if (!experienceCards.length) return null;

  return (
    <section className="section-padding bg-slate-50/90 border-b border-slate-100">
      <div className="container-wide">
        <p className="section-eyebrow text-slate-600">Experience types</p>
        <h2 className="section-title mt-2 text-slate-900">
          Browse {destinationConfig.destination} by the day you want
        </h2>
        <p className="section-subtitle text-slate-600">
          History, scenery, food, families, private touring — and Walk It Yourself when
          independence is the honest recommendation.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experienceCards.map((card) => (
            <ExperienceCard key={card.slug} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
