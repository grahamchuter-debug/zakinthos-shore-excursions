import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";
import { businessIdentity } from "@/lib/legal/business-identity";

const path = "/cookie-policy";

export const metadata = buildMetadata({
  title: "Cookie Policy",
  description: `Cookie policy for ${SITE.name} — how we use cookies and similar technologies on ${SITE.domain}.`,
  path,
  noindex: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Cookie Policy", path },
];

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Cookie Policy", description: `Cookie policy for ${SITE.name}.`, path })]} />
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="section-title mt-8">Cookie Policy</h1>
          <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
            <p>
              {SITE.name} ({SITE.url}) may use cookies and similar technologies to help the site function,
              remember preferences and understand how visitors use our Zakynthos and the Ionian Islands planning guides.
            </p>
            <p>
              Essential cookies support basic site operation. Analytics cookies, where used, help us see
              aggregate traffic patterns — not to sell personal data. You can control cookies through your
              browser settings; disabling some cookies may affect site functionality.
            </p>
            <p>
              For privacy questions contact{" "}
              <a href={businessIdentity.privacyEmailHref} className="text-coastal-700 hover:underline">
                {businessIdentity.privacyEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
