/**
 * Business/legal identity — derived from destination config + contact mode.
 */

import { destinationConfig } from "@/config/destination";
import { publicContact } from "@/lib/contact";

const { legal, name } = destinationConfig;

export const businessIdentity = {
  tradingName: legal.tradingName,
  legalCompanyName: legal.legalCompanyName,
  legalEntityStatement: `${legal.tradingName} is a trading name of ${legal.legalCompanyName}.`,
  companyNumber: legal.companyNumber,
  registeredJurisdiction: legal.registeredJurisdiction,
  registeredOffice: {
    lines: [...legal.registeredOfficeLines],
    formatted: legal.registeredOfficeFormatted,
    multiline: legal.registeredOfficeLines.join("\n"),
  },
  contactMode: publicContact.mode,
  showDestinationEmails: publicContact.showDestinationEmails,
  customerServiceEmail: publicContact.bookings,
  customerServiceEmailHref: `mailto:${publicContact.bookings}`,
  helloEmail: publicContact.hello,
  helloEmailHref: `mailto:${publicContact.hello}`,
  privacyEmail: publicContact.privacy,
  privacyEmailHref: `mailto:${publicContact.privacy}`,
  /** Single public address for footers / enquire when central, else hello. */
  primaryEmail: publicContact.primary,
  primaryEmailHref: `mailto:${publicContact.primary}`,
  agentStatus: `${name} acts as booking agent for the local excursion provider.`,
  companyDisclosure: `${legal.tradingName} is a trading name of ${legal.legalCompanyName}, registered in ${legal.registeredJurisdiction} under company number ${legal.companyNumber}.`,
  bookingAgentRoleParagraphs: [
    `${legal.legalCompanyName}, trading as ${legal.tradingName}, acts as a booking agent on behalf of independent local excursion providers.`,
    "When you make a booking, we arrange the reservation and collect payment on behalf of the provider identified in your booking confirmation. The excursion itself is supplied and operated by that independent provider.",
    "We remain responsible for providing our booking services with reasonable care and skill. The local provider is responsible for operating the excursion in accordance with the booking description and applicable law.",
  ],
  cancellationLanguage: {
    triggerStatement:
      "If the local provider cancels the excursion, or if we notify you that the booking cannot be fulfilled",
    refundStatement: "We will arrange a refund to the original payment method.",
  },
  localProviderPlaceholder:
    "Local excursion provider identified on your final voucher",
} as const;
