import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ContactEnquiryForm } from "@/components/ContactEnquiryForm";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { businessIdentity } from "@/lib/legal/business-identity";
import { destinationConfig } from "@/config/destination";
import { SITE } from "@/lib/site";

const path = "/enquire";

export const metadata = buildMetadata({
  title: "Enquire / Contact",
  description: `Get in touch about ${SITE.name} — cruise planning, shore excursions and port-day questions.`,
  path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Enquire", path },
];

export default function EnquirePage() {
  const {
    primaryEmail,
    primaryEmailHref,
    showDestinationEmails,
    helloEmail,
    helloEmailHref,
    customerServiceEmail,
    customerServiceEmailHref,
  } = businessIdentity;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          webPageSchema({
            title: "Enquire / Contact",
            description: `Get in touch about ${SITE.name} cruise planning.`,
            path,
          }),
        ]}
      />
      <PageHero
        title="Enquire / Contact"
        subtitle={`Questions about your ${destinationConfig.destination} port day, shore excursions or our cruise planner? Tell us a little and we'll point you in the right direction.`}
        compact
      />
      <section className="section-padding">
        <div className="container-wide max-w-xl">
          <Breadcrumbs items={breadcrumbs} />
          <p className="mt-6 text-sm text-gray-600">
            {showDestinationEmails ? (
              <>
                You can also email{" "}
                <a href={helloEmailHref} className="text-coastal-700 hover:underline">
                  {helloEmail}
                </a>{" "}
                or{" "}
                <a href={customerServiceEmailHref} className="text-coastal-700 hover:underline">
                  {customerServiceEmail}
                </a>{" "}
                for booking enquiries.
              </>
            ) : (
              <>
                Email us at{" "}
                <a href={primaryEmailHref} className="text-coastal-700 hover:underline">
                  {primaryEmail}
                </a>
                .
              </>
            )}
          </p>
          <ContactEnquiryForm
            toEmail={primaryEmail}
            siteName={SITE.name}
            destinationLabel={destinationConfig.destination}
          />
        </div>
      </section>
    </>
  );
}
