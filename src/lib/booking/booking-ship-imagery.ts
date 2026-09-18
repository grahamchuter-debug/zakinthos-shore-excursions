/**
 * Optional ship photography for the booking ship-selection step.
 *
 * Exact-vessel rule: imagery is only returned when catalogue metadata is
 * publishable (verified vessel + complete source/licence). Ships without a
 * publishable entry use the premium fallback card — never another vessel.
 */
import {
  getShipImageMetadata,
  isShipImageMetadataPublishable,
} from "@/lib/booking/ship-image-metadata";

export type BookingShipImage = {
  /** Primary WebP path */
  src: string;
  srcSet: string;
  avifSrcSet?: string;
  alt: string;
  width: number;
  height: number;
  /**
   * CSS object-position for the feature crop (e.g. "center 55%").
   * Prefer per-vessel framing over one fixed crop for every ship.
   */
  imagePosition?: string;
};

function buildShipImagePaths(
  slug: string,
  alt: string,
  dims: { width: number; height: number },
  imagePosition?: string,
): BookingShipImage {
  const base = `/images/ships/${slug}`;
  return {
    src: `${base}-1920.webp`,
    srcSet: `${base}-1280.webp 1280w, ${base}-1920.webp 1920w`,
    avifSrcSet: `${base}-1280.avif 1280w, ${base}-1920.avif 1920w`,
    alt,
    width: dims.width,
    height: dims.height,
    ...(imagePosition ? { imagePosition } : {}),
  };
}

/** Default dimensions for ship-card crops until measured per asset. */
const DEFAULT_DIMS = { width: 1920, height: 1080 } as const;

export function getBookingShipImage(
  slug: string,
): BookingShipImage | undefined {
  const meta = getShipImageMetadata(slug);
  if (!meta || !isShipImageMetadataPublishable(meta)) {
    return undefined;
  }

  return buildShipImagePaths(
    meta.slug,
    `${meta.shipName} cruise ship`,
    DEFAULT_DIMS,
    meta.imagePosition,
  );
}
