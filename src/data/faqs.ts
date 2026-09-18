import type { FAQ } from "./types";
import { getHomepageFaqs } from "./homepage";

export const extraFaqs: FAQ[] = [
  {
    question: "Can I explore Zakynthos without an excursion?",
    answer:
      "Yes. Zakynthos Town’s harbour, Solomos Square and central streets are well suited to independent exploration. Many visitors walk the promenade, squares and a café stop without an organised tour.",
  },
  {
    question: "How far is the harbour from the cruise port?",
    answer:
      "Often around 10–25 minutes on foot to Solomos Square and the main promenade, depending on berth or tender landing, pace and route.",
  },
  {
    question: "Can I walk onto Navagio Beach?",
    answer:
      "Do not assume so. Access to Navagio Beach itself has been subject to safety restrictions. Plan to admire the cove from approved viewpoints or from the water unless authorities have reopened access for your sailing dates.",
  },
  {
    question: "Are Blue Caves realistic on a cruise day?",
    answer:
      "Often yes on a solid call via an organised boat trip. Expect embarkation time, open-water conditions and a disciplined return buffer. Short calls may be better spent in Zakynthos Town.",
  },
  {
    question: "Should I book a tour?",
    answer:
      "Book when you want Blue Caves, Navagio viewpoints from the water, island interior villages, structured narrative, mobility support, or simply prefer not to manage boat or road logistics yourself. Skip when you prefer self-paced wandering and café culture in town.",
  },
  {
    question: "How walkable is Zakynthos Town?",
    answer:
      "The harbour and central streets are relatively flat and cruise-friendly. Side streets can be busier in peak season. West-coast caves and inland villages need boat or road transfer.",
  },
  {
    question: "Will I see loggerhead turtles?",
    answer:
      "Not guaranteed. Zakynthos is an important nesting island for Caretta caretta, but sightings depend on season, conditions and luck. Plan a day that remains worthwhile without a turtle encounter.",
  },
  {
    question: "How much free time should I allow before all-aboard?",
    answer:
      "Protect 60–90 minutes after sightseeing for a town day. Boat days and especially full island 4x4 circuits need the larger end of that buffer.",
  },
  {
    question: "What is your Editor's Choice?",
    answer:
      "Panoramic Island Views of Zakynthos by 4x4 — the strongest organised island-interior day currently in our Shore Excursions Group catalogue when hours ashore can honestly support the journey.",
  },
  {
    question: "What currency is used?",
    answer:
      "Greece uses the euro (EUR). Cards are widely accepted; a little cash still helps for smaller cafés and shops.",
  },
];

export function getAllFaqs(): FAQ[] {
  const seen = new Set<string>();
  const merged: FAQ[] = [];
  for (const faq of [...getHomepageFaqs(), ...extraFaqs]) {
    if (seen.has(faq.question)) continue;
    seen.add(faq.question);
    merged.push(faq);
  }
  return merged;
}
