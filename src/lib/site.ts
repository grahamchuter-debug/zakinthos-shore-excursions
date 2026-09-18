import { destinationConfig } from "@/config/destination";
import { publicContact } from "@/lib/contact";

/** Site metadata — derived from destination config. */
export const SITE = {
  name: destinationConfig.name,
  domain: destinationConfig.domain,
  url: destinationConfig.url,
  tagline: destinationConfig.strapline,
  description: destinationConfig.description,
  /** Public contact email (central ops or local hello, per contactMode). */
  email: publicContact.primary,
  locale: destinationConfig.locale,
} as const;
