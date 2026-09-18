import Link from "next/link";

const ZAKYNTHOS_LINKS = [
  {
    title: "Tour or independent?",
    description:
      "Honest comparison for Zakynthos cruise passengers — when to walk alone and when a guide helps.",
    href: "/compare/tour-or-independent",
  },
  {
    title: "Best Zakynthos shore excursions",
    description:
      "Our curated launch collection — Editor’s Choice first, with honest trade-offs for every option.",
    href: "/compare/best-shore-excursions",
  },
  {
    title: "Walking from Zakynthos port",
    description:
      "How far the waterfront really is, and how to reach the promenade on foot.",
    href: "/guides/walking-from-port",
  },
  {
    title: "Can you explore independently?",
    description:
      "When a flexible foot day is the better choice — and when organised transport earns its place.",
    href: "/guides/explore-independently",
  },
  {
    title: "First time in Zakynthos",
    description:
      "A practical first-call plan: town walking, Blue Caves coastline, or Editor’s Choice island day when hours allow.",
    href: "/compare/first-time-zakinthos-day",
  },
  {
    title: "Zakynthos cruise schedules",
    description:
      "Confirmed ship-call data will appear here once schedules are ready for publication.",
    href: "/ship-schedules/zakinthos",
  },
];

export function DestinationQuickLinks() {
  return (
    <section className="section-padding bg-coastal-50 border-t border-coastal-100">
      <div className="container-wide">
        <p className="section-eyebrow">Keep planning</p>
        <h2 className="section-title mt-2">Your Zakynthos planning hub</h2>
        <p className="section-subtitle">
          Use these guides and comparisons to shape a port day that matches your ship hours, energy
          and curiosity — whether you stay in Zakynthos Town or travel to the coastline and island interior.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ZAKYNTHOS_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="card-feature group">
              <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">
                {link.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{link.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/guides" className="btn-secondary text-sm">
            All Zakynthos planning guides
          </Link>
        </div>
      </div>
    </section>
  );
}
