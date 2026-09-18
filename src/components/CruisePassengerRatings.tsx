const RATINGS = [
  { label: "Walking Around Port", stars: 5 },
  { label: "History", stars: 5 },
  { label: "Food & Wine", stars: 5 },
  { label: "Scenery", stars: 5 },
  { label: "Photography", stars: 5 },
  { label: "Families", stars: 4 },
  { label: "Independent Exploring", stars: 5 },
  { label: "Adventure", stars: 5 },
  { label: "Shopping", stars: 4 },
] as const;

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-500" aria-label={`${stars} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < stars ? "text-amber-500" : "text-gray-300"} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

export function CruisePassengerRatings() {
  return (
    <section className="section-padding bg-coastal-50 border-b border-coastal-100">
      <div className="container-wide max-w-4xl">
        <p className="section-eyebrow">Zakynthos cruise port ratings</p>
        <h2 className="section-title mt-2">How Zakynthos scores for cruise passengers</h2>
        <p className="section-subtitle">
          Editorial ratings based on walkability, cultural depth, food culture, scenery and how well
          the port suits independent explorers — not a review of any single tour operator.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RATINGS.map((r) => (
            <div key={r.label} className="card-feature flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-900">{r.label}</span>
              <StarRating stars={r.stars} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
