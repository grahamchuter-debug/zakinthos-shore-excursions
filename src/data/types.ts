import type { WhyWeChoseThisExcursion } from "./why-we-chose-types";
import type { DestinationCurrencyCode } from "@/lib/commerce/currency";

export interface FAQ {
  question: string;
  answer: string;
}

export type Pace = "Relaxed" | "Moderate" | "Active";

/** Flexible supplier model — SEG today, affiliates and exclusives later. */
export type SupplierKind =
  | "shore-excursions-group"
  | "affiliate"
  | "exclusive"
  | "future"
  | "editorial";

export interface ExcursionSupplier {
  kind: SupplierKind;
  name: string;
  /** Optional booking or affiliate URL when live */
  url?: string;
  productId?: string;
  notes?: string;
}

export interface ExcursionItineraryStop {
  title: string;
  detail: string;
}

export interface ExcursionPage {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: string;
  tagline: string;
  duration: string;
  pace: Pace;
  bestFor: string;
  overview: string;
  body: string[];
  highlights: string[];
  included: string[];
  notIncluded?: string[];
  itinerary?: ExcursionItineraryStop[];
  portLogistics: string;
  tips: string[];
  faqs: FAQ[];
  relatedExcursionSlugs: string[];
  featured?: boolean;
  /**
   * Customer-facing major-unit price (no FX). Prefer with `priceCurrency`.
   * @deprecated Use priceAmount + priceCurrency for multi-currency destinations.
   */
  priceEur?: number;
  /** Authoritative major-unit retail price for display + booking alignment */
  priceAmount?: number;
  /** ISO currency for this product’s selling market */
  priceCurrency?: DestinationCurrencyCode;
  /**
   * Preferred availability flag for World 2.0.
   * `live` enables online booking when `bookingPath` is set.
   */
  bookingStatus?: import("@/lib/booking-status").BookingStatus;
  /**
   * @deprecated Prefer `bookingStatus`. Mapped as true→live, false→enquiryOnly.
   */
  bookable?: boolean;
  bookingPath?: string;
  returnGuarantee?: string;
  walkingLevel?: string;
  cruiseSuitability?: string;
  /**
   * World 2.0 Editor's Choice — set true only for carefully selected excursions.
   * Never hard-code by slug in UI; render `<EditorsChoice />` / `<EditorsChoiceBadge />` when true.
   */
  editorChoice?: boolean;
  /** Concierge editorial — reusable World 2.0 section */
  whyWeChose?: WhyWeChoseThisExcursion;
  /** Optional supplier — keep flexible for SEG, affiliates and future exclusives */
  supplier?: ExcursionSupplier;
}

export interface TransferOption {
  name: string;
  description: string;
  duration: string;
  priceEstimate: string;
  bestFor: string;
}

export interface TransferPage {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: string;
  tagline: string;
  overview: string;
  body: string[];
  options: TransferOption[];
  timing: string[];
  tips: string[];
  faqs: FAQ[];
  relatedTransferSlugs: string[];
  featured?: boolean;
}

export interface HotelArea {
  name: string;
  description: string;
  bestFor: string;
}

export interface HotelPick {
  name: string;
  description: string;
  distance: string;
}

export interface HotelPage {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: string;
  tagline: string;
  overview: string;
  body: string[];
  areas: HotelArea[];
  picks: HotelPick[];
  tips: string[];
  faqs: FAQ[];
  relatedHotelSlugs: string[];
  featured?: boolean;
}

export interface GettingThereStep {
  method: string;
  detail: string;
  time: string;
  cost: string;
}

export interface AttractionPage {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  attractionName: string;
  tagline: string;
  overview: string;
  body: string[];
  distanceFromPort: string;
  travelTime: string;
  timeNeeded: string;
  gettingThere: GettingThereStep[];
  highlights: string[];
  tips: string[];
  faqs: FAQ[];
  relatedAttractionSlugs: string[];
  relatedExcursionSlug?: string;
}

export interface ScheduleEntry {
  date: string;
  ship: string;
  cruiseLine: string;
  arrival: string;
  departure: string;
  timeInPort?: string;
  terminal?: string;
  callType?: string;
  notes?: string;
}

export interface ShipSchedulePort {
  slug: string;
  name: string;
  country: string;
  description: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  scheduleOverview: string;
  planningTips?: string[];
  faqs?: FAQ[];
}

export interface VisitorType {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  href: string;
  cta: string;
}

export type EditorialCategory =
  | "editors-choice"
  | "best-historic"
  | "best-independent"
  | "best-coastal"
  | "best-view"
  | "best-got"
  | "best-families"
  | "best-photography"
  | "best-food"
  | "best-luxury"
  | "hidden-gem"
  | "best-value"
  | "best-short-port";

export interface EditorialRecommendation {
  category: EditorialCategory;
  title: string;
  description: string;
  href: string;
  /** Signature Experiences — unique curated offerings; use Signature Experience badge */
  signature?: boolean;
}

/** Numbered stop on a self-guided independent walk (Walk It Yourself). */
export interface IndependentWalkStop {
  number: number;
  title: string;
  description: string;
  durationMinutes?: number;
  tip?: string;
}

export interface IndependentWalkDontMiss {
  category: string;
  title: string;
  description: string;
}

export interface IndependentWalkCoffeeStop {
  name: string;
  description: string;
  specialty?: string;
  nearStop?: string;
}

export interface IndependentWalkLocalTip {
  label: string;
  detail: string;
}

export interface IndependentWalkBackToShip {
  latestDeparture: string;
  walkingTime: string;
  taxiAlternative: string;
  safetyMargin: string;
  notes?: string;
}

export interface IndependentWalkExploreFurther {
  excursionSlug: string;
  title: string;
  body: string;
  href: string;
  /** Soft link label — avoid hard-sell language */
  ctaLabel?: string;
}

/**
 * Rich self-guided walking content for Independent Explorer guides.
 * Customer-facing brand is typically “Walk It Yourself”; keep the guide slug
 * `explore-independently` for stable routing across destinations.
 */
export interface IndependentWalkContent {
  /** Hero/meta eyebrow — e.g. Free self-guided route */
  eyebrow?: string;
  idealFor: string[];
  duration: string;
  distance: string;
  difficulty: string;
  bestFor: string[];
  familyFriendly?: boolean;
  wheelchairFriendly?: boolean;
  route: IndependentWalkStop[];
  dontMiss: IndependentWalkDontMiss[];
  coffeeStops: IndependentWalkCoffeeStop[];
  localTips: IndependentWalkLocalTip[];
  backToShip: IndependentWalkBackToShip;
  recommendedReturnBuffer?: string;
  exploreFurther: IndependentWalkExploreFurther;
}

export interface GuidePage {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  tagline: string;
  overview: string;
  body: string[];
  highlights: string[];
  tips: string[];
  faqs: FAQ[];
  recommendations?: EditorialRecommendation[];
  relatedSlugs: string[];
  imageKey: string;
  hubPath: string;
  /**
   * Optional rich Walk It Yourself sections.
   * When set, GuideArticle renders the full independent-walk editorial layout.
   */
  independentWalk?: IndependentWalkContent;
}

export interface ComparisonTableRow {
  category: string;
  optionA: string;
  optionB: string;
}

export interface ComparisonGuideItem {
  name: string;
  slug: string;
  href: string;
  reason: string;
  topExcursion: string;
  returnConfidence: string;
  walkingDifficulty: string;
}

export interface Comparison {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  kind: "versus" | "guide";
  optionA?: string;
  optionB?: string;
  summary: string;
  verdict: string;
  overview: string[];
  comparisonTable?: ComparisonTableRow[];
  guideItems?: ComparisonGuideItem[];
  faqs: FAQ[];
  relatedSlugs: string[];
  imageKey: string;
}

/**
 * Experience Card kinds — ways of experiencing a destination.
 * Expand freely. Editor's Choice remains a separate badge/callout system
 * (`editorChoice` + EditorsChoiceBadge); do not style these cards as awards.
 */
export type ExperienceCardType =
  | "walk-it-yourself"
  | "history"
  | "nature"
  | "food-wine"
  | "photography"
  | "families"
  | "luxury"
  | "independent-explorer"
  | "private"
  | "guided"
  | "custom";

/**
 * Editorial pathway card — decision-first navigation, not a product badge.
 * Walk It Yourself may include duration / distance / difficulty / idealFor.
 */
export interface ExperienceCard {
  slug: string;
  /** Visual / semantic kind for styling and future filtering */
  type?: ExperienceCardType;
  title: string;
  description: string;
  href: string;
  cta: string;
  imageKey: string;
  /** Small uppercase line above the title (e.g. FREE SELF-GUIDED ROUTE) */
  eyebrow?: string;
  duration?: string;
  distance?: string;
  difficulty?: string;
  idealFor?: string;
}
