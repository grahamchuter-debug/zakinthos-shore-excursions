import type { FAQ } from "./types";

/** Keep path aligned with `src/app/signature-riviera-experience/` to avoid broken builds. */
export const SIGNATURE_EXPERIENCE_PATH = "/signature-riviera-experience";

export interface SignatureBenefit {
  emoji: string;
  title: string;
  description: string;
}

export const signatureZakynthosExperience = {
  slug: "signature-riviera-experience",
  title: "Signature Ionian Discovery",
  seoTitle: "Signature Ionian Discovery — Future Private Day from Zakynthos",
  metaDescription:
    "Preview a future small-group Zakynthos shore experience — maximum eight guests, coastal character and olive-grove villages. Not bookable yet.",
  tagline:
    "A future small-group journey through Zakynthos Town, coastal cliffs and olive hills — designed around your ship, not a generic day tour.",
  overview:
    "Signature Ionian Discovery is a product concept in preparation. The proposed experience would take no more than eight guests from Zakynthos through carefully paced harbour, coastal and inland highlights, with optional Blue Caves or Navagio viewpoint emphasis when hours and conditions allow, a local lunch and enough flexibility to respond to the group, weather and port timings. It does not currently exist as a bookable excursion.",
  comingSoon: true,
  benefits: [
    {
      emoji: "👥",
      title: "Maximum 8 guests",
      description: "A proposed small-group format intended to avoid coach-tour delays and support personal attention.",
    },
    {
      emoji: "🌊",
      title: "Ionian focus",
      description: "Harbour light, olive-grove villages and optional coastal cave depth at the heart of the concept.",
    },
    {
      emoji: "📸",
      title: "Photography stops",
      description: "Time for cliff light, turquoise water and village lanes rather than images through a coach window.",
    },
    {
      emoji: "🍽️",
      title: "Local lunch",
      description: "A relaxed Ionian lunch proposed as part of the experience, subject to final partner arrangements.",
    },
    {
      emoji: "🧭",
      title: "Flexible itinerary",
      description: "Room to adjust for weather, crowds and the interests of a small group — including coastline when the call supports it.",
    },
    {
      emoji: "🚢",
      title: "Ship-first timing",
      description: "Planned backwards from all-aboard with a conservative Zakynthos return buffer.",
    },
  ] as SignatureBenefit[],
  faqs: [
    {
      question: "Can I book Signature Ionian Discovery now?",
      answer:
        "No. It is a future concept in preparation and is not bookable. Explore current Zakynthos shore excursions or enquire for updates.",
    },
    {
      question: "How is this different from Editor's Choice?",
      answer:
        "Editor’s Choice is our current recommended island 4x4 introduction. Signature is a future small-group flagship concept with a stricter guest limit and more flexible pacing across harbour, coastline and inland hills.",
    },
  ] as FAQ[],
};

/** Primary export name expected by existing Signature Experience components and route. */
export const signatureRivieraExperience = signatureZakynthosExperience;

export function getSignatureEditorialRecommendation() {
  return {
    category: "best-got" as const,
    title: signatureRivieraExperience.title,
    description:
      "A future maximum-eight-guest Ionian experience. In preparation and not currently bookable.",
    href: SIGNATURE_EXPERIENCE_PATH,
    signature: true,
    comingSoon: true,
  };
}
