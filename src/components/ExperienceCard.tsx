import Link from "next/link";
import type { ExperienceCard as ExperienceCardData } from "@/data/types";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { subjectImages, siteImages, type SiteImage } from "@/lib/images";

function resolveImage(key: string): SiteImage {
  return subjectImages[key] ?? subjectImages.historic ?? siteImages.hero;
}

type ExperienceCardProps = {
  card: ExperienceCardData;
  /** Larger featured treatment on homepage decision grids */
  featured?: boolean;
  className?: string;
};

/**
 * World 2.0 Experience Card — editorial pathways for “how would you like
 * to experience this destination?” Never use gold award styling here;
 * Editor's Choice remains EditorsChoiceBadge / EditorsChoice.
 */
export function ExperienceCard({
  card,
  featured = false,
  className = "",
}: ExperienceCardProps) {
  const image = resolveImage(card.imageKey);
  const isWalk =
    card.type === "walk-it-yourself" ||
    card.type === "independent-explorer" ||
    card.slug === "walk-it-yourself" ||
    card.slug === "explore-independently";
  const meta = [card.duration, card.distance, card.difficulty, card.idealFor].filter(
    Boolean,
  ) as string[];

  const rootClass = [
    "experience-card group",
    isWalk ? "experience-card--walk" : "",
    featured ? "experience-card--featured" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={card.href} className={rootClass}>
      <div className={`relative overflow-hidden ${featured ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        <ResponsiveImage
          image={image}
          role="card"
          imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"
          aria-hidden="true"
        />
        {card.eyebrow ? (
          <span className="experience-card-eyebrow absolute left-4 top-4">{card.eyebrow}</span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold text-slate-900 group-hover:text-coastal-800 sm:text-[1.35rem]">
          {card.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{card.description}</p>

        {meta.length > 0 ? (
          <ul className="experience-card-meta mt-4">
            {meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}

        <span className="mt-5 text-sm font-semibold tracking-wide text-coastal-700 group-hover:text-coastal-600">
          {card.cta} →
        </span>
      </div>
    </Link>
  );
}
