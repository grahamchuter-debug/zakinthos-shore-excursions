import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";
import Link from "next/link";

const path = "/return-to-ship-guarantee";

export const metadata = buildMetadata({
  title: "Return to Ship Guarantee",
  description: `How ${SITE.name} plans shore excursions around your cruise call and what the return-to-ship assurance means.`,
  path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Return to Ship Guarantee", path },
];

export default function ReturnToShipGuaranteePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          webPageSchema({
            title: "Return to Ship Guarantee",
            description: `Return-to-ship planning for ${SITE.name}.`,
            path,
          }),
        ]}
      />
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="section-title mt-8">Return to Ship Guarantee</h1>
          <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
            <p>
              Every bookable excursion on {SITE.name} is planned backwards from your ship’s
              all-aboard time. Meeting points, road buffers and free-time windows are chosen so you
              return to Zakynthos with time to spare — not clinging to the published departure clock.
            </p>
            <p>
              If an operational delay on our side causes you to miss the ship, we work with the
              local provider under the return-to-ship assurance stated on your booking confirmation.
              Always confirm the exact wording on your voucher for the sailing you book.
            </p>
            <p>
              Your responsibility remains to arrive at the meeting point on time, follow guide
              instructions and allow for personal pauses that sit outside the planned itinerary.
            </p>
            <p>
              Read the full commercial terms on our{" "}
              <Link href="/booking-conditions" className="font-semibold text-coastal-800 underline">
                Booking Conditions
              </Link>{" "}
              page, or{" "}
              <Link href="/enquire" className="font-semibold text-coastal-800 underline">
                contact the concierge team
              </Link>{" "}
              before you book.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
