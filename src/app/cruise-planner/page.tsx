import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { CruisePlanner } from "@/components/CruisePlanner";

const path = "/cruise-planner";
const description =
  "Build a personalised Zakynthos cruise plan. Enter your port times, party size, interests, mobility, budget and travel style for tailored the Ionian Islands recommendations.";

export const metadata = buildMetadata({
  title: "Zakynthos Cruise Planner — Mainland Greece Port Day Itinerary",
  description,
  path,
  keywords: ["Zakynthos cruise planner", "the Ionian Islands cruise day plan", "Zakynthos port day itinerary", "Navagio from Zakynthos planner"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Zakynthos Cruise Planner", path },
];

export default function CruisePlannerPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Zakynthos Cruise Planner", description, path })]} />
      <PageHero
        title="Zakynthos Cruise Planner"
        subtitle="Tell us your ship's hours ashore, who is travelling and what you enjoy — get editorial recommendations for olive-grove villages, Navagio, Zakynthos waterfront and independent days."
        compact
      />
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <Breadcrumbs items={breadcrumbs} />
          <CruisePlanner />
        </div>
      </section>
    </>
  );
}
