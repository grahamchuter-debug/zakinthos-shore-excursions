import type { CruiseScheduleEntry } from "@/lib/cruise-schedule-types";

export type CruiseShipCall = CruiseScheduleEntry & {
  timeInPort: string;
  scheduleMonthSlug: string;
  scheduleMonthLabel: string;
};

export type CruiseShipSummary = {
  slug: string;
  name: string;
  cruiseLine: string;
  callCount: number;
  monthLabels: string[];
};

export type CruiseShipProfile = CruiseShipSummary & {
  calls: CruiseShipCall[];
  typicalVisitLength: string;
  visitLengthCategory: "short" | "standard" | "long" | "mixed";
};
