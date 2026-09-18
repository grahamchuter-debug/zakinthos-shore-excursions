import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

const path = "/cancellation-policy";

export const metadata = buildMetadata({
  title: "Cancellation Policy",
  description: `Cancellation policy for ${SITE.name} shore excursion bookings.`,
  path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Cancellation Policy", path },
];

/** World 2.0 standard route — content mirrors Booking Conditions for cruise clarity. */
export default function CancellationPolicyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          webPageSchema({
            title: "Cancellation Policy",
            description: `Cancellation policy for ${SITE.name}.`,
            path,
          }),
        ]}
      />
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="section-title mt-8">Cancellation Policy</h1>
          <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
            <p>
              Free cancellation is available up to 24 hours before the excursion departure time
              stated on your confirmation, unless your voucher specifies a different window.
            </p>
            <p>
              Cancellations inside that window, or failure to join the departure, may not be
              refundable. If the local provider cancels the excursion, or if we notify you that the
              booking cannot be fulfilled, we will arrange a refund to the original payment method.
            </p>
            <p>
              Full commercial terms are published on our{" "}
              <Link href="/booking-conditions" className="font-semibold text-coastal-800 underline">
                Booking Conditions
              </Link>{" "}
              page.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
