/**
 * Featured-tour helpers — Navagio Editor's Choice used for homepage cards / schema.
 */
import { getBookableProduct } from "@/data/bookable-products";

const flagship = getBookableProduct("panoramic-island-views-4x4");

export const featuredTour = flagship
  ? {
      slug: flagship.slug,
      path: flagship.path,
      bookingPath: flagship.bookingPath,
      cardName: flagship.name,
      fullName: flagship.experienceName,
    }
  : {
      slug: "panoramic-island-views-4x4",
      path: "/shore-excursions/panoramic-island-views-4x4",
      bookingPath: "/book/panoramic-island-views-4x4",
      cardName: "Panoramic Island Views of Zakynthos by 4x4",
      fullName: "Panoramic Island Views of Zakynthos by 4x4",
    };
