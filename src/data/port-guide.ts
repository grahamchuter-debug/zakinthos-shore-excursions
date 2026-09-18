import type { FAQ } from "./types";

export interface Terminal {
  name: string;
  quay: string;
  usedBy: string;
  cityAccess: string;
}

export interface PortGuideSection {
  heading: string;
  paragraphs: string[];
}

export const portGuideContent = {
  title: "Zakynthos Cruise Port Guide",
  subtitle:
    "Terminal access, walking times to the harbour and Solomos Square, food and café culture, transport toward Blue Caves and island interior, and sensible return-to-ship planning.",
  terminals: [
    {
      name: "Zakynthos cruise passenger area",
      quay: "Passenger access near Zakynthos Town harbour on the Ionian Sea",
      usedBy: "Most cruise ships calling at Zakynthos (Zante) on Mediterranean itineraries",
      cityAccess:
        "Often a realistic 10–25 minute walk to Solomos Square and the harbour promenade; taxis available at peak turnaround for boat departures and island hops",
    },
    {
      name: "Tender / alternative landing positions",
      quay: "Occasional tender landings or alternative positions depending on ship and conditions",
      usedBy: "Selected calls when berth assignment or sea state requires it",
      cityAccess:
        "Walking times vary — follow terminal or tender-pier signage and allow a conservative buffer into the town centre",
    },
  ] as Terminal[],
  sections: [
    {
      heading: "Where cruise ships call in Zakynthos",
      paragraphs: [
        "Cruise ships calling at Zakynthos typically berth or tender near Zakynthos Town, with passenger access oriented toward the harbour and civic centre rather than a distant outpost.",
        "Check the ship’s daily programme and terminal signage on arrival. Shuttle arrangements vary by line and assignment; many guests walk to the harbour promenade without needing a transfer.",
        "Zakynthos Town is an excellent base for a city day on foot. Blue Caves, Navagio viewpoints and inland olive-grove villages are separate journeys requiring boat or road time.",
      ],
    },
    {
      heading: "Walking from the port",
      paragraphs: [
        "From the passenger area, follow signs toward Zakynthos Town and the harbour rather than wandering the working port.",
        "Allow roughly 10–25 minutes to reach Solomos Square in normal conditions, longer from more distant landings or at a slower pace.",
        "If mobility, weather or luggage are factors, take a short taxi instead of proving a point.",
      ],
    },
    {
      heading: "Zakynthos Town highlights",
      paragraphs: [
        "Solomos Square and the harbour promenade anchor most first visits — allow time to absorb Ionian light and café culture.",
        "St Mark’s Square, optional museum time and shopping streets reward a human pace.",
        "Harbour cafés are part of the destination, not a sideshow — pace lingering with all-aboard in mind.",
      ],
    },
    {
      heading: "Beyond the town — coastline and island interior",
      paragraphs: [
        "Blue Caves and dramatic cliffs are the stronger coastal day for many cruise calls — luminous arches and turquoise water from an organised boat.",
        "Navagio’s famous cove is best admired from approved viewpoints or from the water. Beach access has been subject to safety restrictions — do not assume a landing.",
        "The Editor’s Choice 4x4 island day explores olive groves and panoramic ridges inland. Do not try to combine boat, 4x4 and a full town checklist in one port day.",
      ],
    },
    {
      heading: "Food near the port",
      paragraphs: [
        "Zakynthos is serious about Ionian flavours — seafood, olive oil and bakeries sit within walking distance of many landings.",
        "Choose busy harbour rooms, share plates where it makes sense, and protect your ship buffer.",
      ],
    },
    {
      heading: "Return to ship",
      paragraphs: [
        "Plan from all-aboard, not published departure. Aim to be back at the terminal 60–90 minutes early.",
        "Boat days and especially full island 4x4 circuits need the larger end of that buffer. The ship will not wait.",
      ],
    },
  ] as PortGuideSection[],
  faqs: [
    {
      question: "Can I walk into Zakynthos Town from the cruise port?",
      answer:
        "Usually yes for the harbour, Solomos Square and central streets. Exact times depend on berth or tender assignment — follow signage and keep a buffer.",
    },
    {
      question: "Do I need a shore excursion?",
      answer:
        "Not for the town if you enjoy walking. Yes for Blue Caves or Navagio viewpoints from the water if coastline is the priority, and yes for the Editor’s Choice 4x4 if you want island interior scenery with cruise-safe timing.",
    },
    {
      question: "What is the best first stop?",
      answer:
        "Solomos Square and the harbour promenade — then decide whether to continue into town, leave for a coastal boat day, or keep the day for the inland 4x4 circuit on a long call.",
    },
  ] satisfies FAQ[],
};

export const terminals = portGuideContent.terminals;
export const portGuideSections = portGuideContent.sections;
export const portGuideFaqs = portGuideContent.faqs;
