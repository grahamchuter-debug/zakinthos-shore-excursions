import Link from "next/link";
import {
  cruisePositioning,
  dayAshoreIntro,
  dayAshoreItems,
  type DayAshoreItem,
} from "@/data/cruise-positioning";

function DayAshoreIcon({ type }: { type: DayAshoreItem["icon"] }) {
  const common = {
    className: "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (type) {
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.25" />
          <path d="M12 8v4.25L15 15" />
        </svg>
      );
    case "route":
      return (
        <svg {...common}>
          <circle cx="6.5" cy="6.5" r="2.25" />
          <circle cx="17.5" cy="17.5" r="2.25" />
          <path d="M8.5 8.5c2.5 0 3.5 2 5 4s2.5 4 5 4" />
        </svg>
      );
    case "walk":
      return (
        <svg {...common}>
          <circle cx="13" cy="5" r="1.75" />
          <path d="M10.5 21l1.5-5.5 2-2 2.5 3.5" />
          <path d="M8 12.5l3.5-1.5 2.5 1.5" />
          <path d="M9.5 21l-1.5-5" />
        </svg>
      );
    case "sunrise":
      return (
        <svg {...common}>
          <path d="M4 17h16" />
          <path d="M7 17a5 5 0 0 1 10 0" />
          <path d="M12 7v2.5" />
          <path d="M6.2 10.2l1.5 1.5" />
          <path d="M17.8 10.2l-1.5 1.5" />
        </svg>
      );
    case "viewpoint":
      return (
        <svg {...common}>
          <path d="M3.5 12s3.2-5.5 8.5-5.5S20.5 12 20.5 12s-3.2 5.5-8.5 5.5S3.5 12 3.5 12z" />
          <circle cx="12" cy="12" r="2.25" />
        </svg>
      );
    case "food":
      return (
        <svg {...common}>
          <path d="M8 4v8" />
          <path d="M6.5 4v4.5a1.5 1.5 0 0 0 3 0V4" />
          <path d="M8 12v8" />
          <path d="M15.5 4v7a2 2 0 0 0 2 2" />
          <path d="M15.5 4c1.2 0 2.5.8 2.5 2.5S16.7 9 15.5 9" />
          <path d="M15.5 13v7" />
        </svg>
      );
    case "family":
      return (
        <svg {...common}>
          <circle cx="9" cy="7" r="2" />
          <circle cx="16" cy="8" r="1.75" />
          <path d="M4.5 19v-1.5a3.5 3.5 0 0 1 3.5-3.5h2A3.5 3.5 0 0 1 13.5 17.5V19" />
          <path d="M14 19v-1.25a2.75 2.75 0 0 1 2.75-2.75h.5A2.75 2.75 0 0 1 20 17.75V19" />
        </svg>
      );
    case "luxury":
      return (
        <svg {...common}>
          <path d="M12 3.5l2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 14.8 7.7 16.8l.8-4.8-3.5-3.4 4.8-.7L12 3.5z" />
        </svg>
      );
  }
}

export function YourDayAshore() {
  if (!cruisePositioning.showDayAshoreSection) return null;

  return (
    <section className="section-padding bg-coastal-50/80 border-b border-coastal-100">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="section-eyebrow">Cruise-day planning</p>
          <h2 className="section-title mt-2">Your Day Ashore</h2>
          <p className="section-subtitle">{dayAshoreIntro}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dayAshoreItems.map((item) => {
            const inner = (
              <div className="flex h-full items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coastal-50 text-coastal-700 ring-1 ring-coastal-100">
                  <DayAshoreIcon type={item.icon} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
                </div>
              </div>
            );

            const className =
              "rounded-2xl border border-coastal-100/90 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6";

            return item.href ? (
              <Link key={item.id} href={item.href} className={`${className} block`}>
                {inner}
              </Link>
            ) : (
              <article key={item.id} className={className}>
                {inner}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
