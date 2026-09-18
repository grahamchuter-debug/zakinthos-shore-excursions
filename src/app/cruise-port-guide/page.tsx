import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PhotoHeroBand } from "@/components/PhotoHeroBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQSection } from "@/components/FAQSection";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, articleSchema } from "@/lib/schema";
import { siteImages } from "@/lib/images";
import { portGuideContent, portGuideFaqs } from "@/data/port-guide";

const path = "/cruise-port-guide";
const image = siteImages.port;
const description =
  "The complete Zakynthos cruise port guide — terminal layout, walking routes, taxis, waterfront access and return-to-ship timing.";

export const metadata = buildMetadata({
  title: "Zakynthos Cruise Port Guide",
  description,
  path,
  image: image.src,
  imageAlt: image.alt,
  keywords: ["Zakynthos cruise port", "Zakynthos cruise terminal", "Zakynthos port to waterfront", "Zakynthos cruise port guide"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Zakynthos Cruise Port Guide", path },
];

export default function CruisePortGuidePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          faqSchema(portGuideFaqs),
          articleSchema({
            title: portGuideContent.title,
            description,
            path,
            image: image.src,
          }),
        ]}
      />
      <PhotoHeroBand
        title={portGuideContent.title}
        subtitle={portGuideContent.subtitle}
        image={image}
      />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 pr-4 font-semibold text-gray-900">Terminal</th>
                  <th className="py-3 pr-4 font-semibold text-gray-900">Quay</th>
                  <th className="py-3 pr-4 font-semibold text-gray-900">Used by</th>
                  <th className="py-3 font-semibold text-gray-900">City access</th>
                </tr>
              </thead>
              <tbody>
                {portGuideContent.terminals.map((t) => (
                  <tr key={t.name} className="border-b border-gray-100 align-top">
                    <td className="py-4 pr-4 font-medium text-gray-900">{t.name}</td>
                    <td className="py-4 pr-4 text-gray-700">{t.quay}</td>
                    <td className="py-4 pr-4 text-gray-700">{t.usedBy}</td>
                    <td className="py-4 text-gray-700">{t.cityAccess}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {portGuideContent.sections.map((section) => (
            <div key={section.heading} className="mt-12">
              <h2 className="font-display text-2xl font-bold text-gray-900">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-12">
            <FAQSection faqs={portGuideFaqs} title="Zakynthos port FAQs" />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/guides/walking-from-port" className="btn-secondary text-sm">
              Walking from the port
            </Link>
            <Link href="/guides/cruise-tips" className="btn-secondary text-sm">
              Cruise tips
            </Link>
          </div>

          <PlanningLinks />
        </div>
      </section>
    </>
  );
}
