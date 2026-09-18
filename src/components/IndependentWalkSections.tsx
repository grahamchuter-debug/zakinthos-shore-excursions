import Link from "next/link";
import type {
  IndependentWalkContent,
  IndependentWalkDontMiss,
} from "@/data/types";

function groupDontMiss(items: IndependentWalkDontMiss[]): Record<string, IndependentWalkDontMiss[]> {
  return items.reduce<Record<string, IndependentWalkDontMiss[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
}

/**
 * Rich Walk It Yourself sections nested inside Independent Explorer guides.
 * Not a separate badge system — Editor's Choice remains EditorsChoiceBadge.
 */
export function IndependentWalkSections({ walk }: { walk: IndependentWalkContent }) {
  const dontMissByCategory = groupDontMiss(walk.dontMiss);

  return (
    <div className="mt-12 space-y-16">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-coastal-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-coastal-600">Ideal for</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {walk.idealFor.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-coastal-600">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-coastal-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-coastal-600">At a glance</p>
          <dl className="mt-3 space-y-3 text-sm text-gray-700">
            <div>
              <dt className="font-semibold text-gray-900">Duration</dt>
              <dd>{walk.duration}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Distance</dt>
              <dd>{walk.distance}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Difficulty</dt>
              <dd>{walk.difficulty}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Wheelchair access</dt>
              <dd>
                {walk.wheelchairFriendly ? "Generally suitable" : "Limited — historic surfaces"}
              </dd>
            </div>
          </dl>
        </article>
        <article className="rounded-2xl border border-coastal-100 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-coastal-600">Best for</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {walk.bestFor.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-maple-500">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {walk.familyFriendly ? (
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-coastal-600">
              Family friendly
            </p>
          ) : null}
        </article>
      </div>

      <section>
        <p className="section-eyebrow">Route</p>
        <h2 className="section-title mt-2 text-2xl sm:text-3xl">Your walking route</h2>
        <p className="section-subtitle">
          An editorial route — not a turn-by-turn map. Follow the stops in order, or linger where the
          light is best.
        </p>
        <ol className="relative mt-10 space-y-0">
          {walk.route.map((stop, index) => {
            const isLast = index === walk.route.length - 1;
            return (
              <li key={stop.number} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-8">
                {!isLast ? (
                  <span
                    className="absolute left-[1.15rem] top-12 bottom-0 w-px bg-gradient-to-b from-coastal-300 to-coastal-100 sm:left-[1.4rem]"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coastal-800 font-display text-sm font-semibold text-white shadow-md sm:h-12 sm:w-12 sm:text-base">
                  {stop.number}
                </span>
                <div className="min-w-0 flex-1 rounded-2xl border border-coastal-100/90 bg-[#faf9f7] p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold text-gray-900">{stop.title}</h3>
                    {stop.durationMinutes != null ? (
                      <span className="text-xs font-medium uppercase tracking-wide text-coastal-600">
                        ~{stop.durationMinutes} min
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                    {stop.description}
                  </p>
                  {stop.tip ? (
                    <p className="mt-3 text-sm italic text-gray-600">Tip: {stop.tip}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <p className="section-eyebrow">Don&apos;t miss</p>
        <h2 className="section-title mt-2 text-2xl sm:text-3xl">Worth seeking out</h2>
        <p className="section-subtitle">
          Viewpoints, quieter streets and details that repay a slower pace.
        </p>
        <div className="mt-8 space-y-8">
          {Object.entries(dontMissByCategory).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-display text-lg font-semibold text-coastal-800">{category}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <article
                    key={`${item.category}-${item.title}`}
                    className="rounded-2xl border border-coastal-100 bg-white/90 p-5 shadow-sm"
                  >
                    <h4 className="font-display text-base font-semibold text-gray-900">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="section-eyebrow">Coffee &amp; cake</p>
        <h2 className="section-title mt-2 text-2xl sm:text-3xl">Where locals actually go</h2>
        <p className="section-subtitle">
          One or two genuine cafés or bakeries — chosen for quality, not proximity to the tour-bus
          stop.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {walk.coffeeStops.map((café) => (
            <article
              key={café.name}
              className="rounded-2xl border border-sandstone-300/50 bg-[#faf8f5] p-6"
            >
              <h3 className="font-display text-xl font-semibold text-gray-900">{café.name}</h3>
              {café.specialty ? (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-maple-600">
                  {café.specialty}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-gray-700">{café.description}</p>
              {café.nearStop ? (
                <p className="mt-3 text-xs text-gray-500">Near: {café.nearStop}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section>
        <p className="section-eyebrow">Local tips</p>
        <h2 className="section-title mt-2 text-2xl sm:text-3xl">Practical notes</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {walk.localTips.map((tip) => (
            <article
              key={tip.label}
              className="rounded-2xl border border-coastal-100/80 bg-white p-5 shadow-sm"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-coastal-700">
                {tip.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{tip.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-coastal-900 px-6 py-10 text-white sm:px-8 sm:py-12">
        <p className="section-eyebrow text-coastal-200">Back to your ship</p>
        <h2 className="section-title mt-2 text-white text-2xl sm:text-3xl">Protect your return</h2>
        <p className="mt-4 max-w-2xl text-coastal-100">
          Independent exploration only works when the buffer is honest. Plan backwards from
          all-aboard.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-coastal-200">
              Latest departure
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/90">{walk.backToShip.latestDeparture}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-coastal-200">
              Walking time
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/90">{walk.backToShip.walkingTime}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-coastal-200">
              Taxi alternative
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/90">{walk.backToShip.taxiAlternative}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-coastal-200">
              Safety margin
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              {walk.recommendedReturnBuffer ?? walk.backToShip.safetyMargin}
            </p>
          </div>
        </div>
        {walk.backToShip.notes ? (
          <p className="mt-6 text-sm leading-relaxed text-coastal-100">{walk.backToShip.notes}</p>
        ) : null}
      </section>

      <section>
        <p className="section-eyebrow">Explore further</p>
        <h2 className="section-title mt-2 text-2xl sm:text-3xl">{walk.exploreFurther.title}</h2>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{walk.exploreFurther.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={walk.exploreFurther.href} className="btn-secondary">
            {walk.exploreFurther.ctaLabel ?? "Explore further"}
          </Link>
          <Link href="/shore-excursions" className="btn-secondary">
            All shore excursions
          </Link>
        </div>
      </section>
    </div>
  );
}
