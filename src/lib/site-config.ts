import { destinationConfig } from "@/config/destination";
import { businessIdentity } from "@/lib/legal/business-identity";
import { SITE } from "@/lib/site";

export const siteConfig = {
  name: businessIdentity.tradingName,
  url: SITE.url,
  locale: SITE.locale,
  defaultDescription: SITE.description,
  copyrightEntity: businessIdentity.tradingName,
  excursionsHubPath: "/shore-excursions",
  excursionsHubLabel: `${destinationConfig.destination} shore excursions`,
  bookingEmail: businessIdentity.customerServiceEmail,
} as const;
