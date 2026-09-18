import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { schedulePorts, getScheduleEntryCount } from "@/data/schedules";
import { SCHEDULE_YEARS, portYearPath, portHubPath } from "@/lib/schedule-utils";

const path = "/ship-schedules";

export const metadata = buildMetadata({
  title: "Zakynthos Cruise Ship Schedules",
  description:
    "Zakynthos cruise ship schedules by year and month. See which ships call before booking Navagio, island interior or city excursions.",
  path,
  keywords: ["Zakynthos cruise ship schedule", "Zakynthos cruise calendar", "Zakynthos ship schedule"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Ship Schedules", path },
];

export default function ShipSchedulesPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Zakynthos Cruise Ship Schedules", description: "Zakynthos cruise ship schedules by year and month.", path })]} />
      <PageHero title="Zakynthos Cruise Ship Schedules" subtitle="See which ships are in port before you book the Ionian Islands excursions. Times and berths are indicative — always confirm with your cruise line." compact />
      <section className="section-padding">
        <div className="container-wide max-w-5xl">
          <Breadcrumbs items={breadcrumbs} />
          {schedulePorts.map((port) => {
            const count = getScheduleEntryCount(port.slug);
            return (
              <div key={port.slug} className="card-editorial p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-gray-900">{port.name}</h2>
                    <p className="mt-2 text-gray-600">{port.scheduleOverview}</p>
                  </div>
                  {count > 0 && <span className="pill">{count} sample entries</span>}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={portHubPath(port.slug)} className="btn-primary text-sm">Full schedule hub</Link>
                  {SCHEDULE_YEARS.map((y) => (
                    <Link key={y} href={portYearPath(port.slug, y)} className="btn-secondary text-sm">{y}</Link>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}
