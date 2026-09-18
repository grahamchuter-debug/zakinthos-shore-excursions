import {bookingCapacityConfig,bookingMeetingConfig,bookingStartTimeConfig,getBookingStartTimeLabel} from "@/lib/booking/booking-config";
import { useBookingTour } from "@/components/booking-engine/booking-tour-context";
import type { BookingShipVisit } from "@/lib/booking/booking-ship-types";
import {
  formatVerifiedShipTime,
} from "@/lib/booking/booking-ship-types";
import {
  calculateBookingTotal,
  formatBookingDate,
  formatBookingMoney,
} from "@/lib/booking/booking-format";

type CruiseDaySummaryProps = {
  date: string;
  guests: number;
  cruiseShip: BookingShipVisit;
  heading?: string;
  onChangeDate?: () => void;
  onChangeShip?: () => void;
  onChangeGuests?: () => void;
};

function SummaryChangeButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="book-btn book-text-link shrink-0 text-[12px] tracking-wide underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--w2-focus-ring)]"
    >
      {label}
    </button>
  );
}

export function CruiseDaySummary({
  date,
  guests,
  cruiseShip,
  heading = "Your Cruise Day",
  onChangeDate,
  onChangeShip,
  onChangeGuests,
}: CruiseDaySummaryProps) {
  const bookingPrototypeTour = useBookingTour();
  /** Excursion start — never derived from ship arrival */
  const tourStartTime = getBookingStartTimeLabel(date);
  const total = formatBookingMoney(calculateBookingTotal(guests, bookingPrototypeTour.pricePerGuest));
  const shipArrival = formatVerifiedShipTime(cruiseShip.arrivalTime);
  const shipDeparture = formatVerifiedShipTime(cruiseShip.departureTime);

  type SummaryRow = {
    label: string;
    value: string;
    note?: string;
    changeLabel?: string;
    onChange?: () => void;
  };

  const rows: SummaryRow[] = [
    {
      label: "Date",
      value: formatBookingDate(date),
      changeLabel: "Change date",
      onChange: onChangeDate,
    },
    {
      label: "Cruise Ship",
      value: cruiseShip.name,
      note: cruiseShip.cruiseLine || undefined,
      changeLabel: "Change ship",
      onChange: onChangeShip,
    },
  ];

  if (shipArrival) {
    rows.push({
      label: "Ship arrival",
      value: shipArrival,
      note: "Published cruise schedule — subject to change by your cruise line.",
    });
  }
  if (shipDeparture) {
    rows.push({
      label: "Ship departure",
      value: shipDeparture,
      note: "Published cruise schedule — subject to change by your cruise line.",
    });
  }

  rows.push(
    {
      label: bookingStartTimeConfig.label,
      value: tourStartTime,
      note: "Excursion start time — separate from your ship’s arrival or departure.",
    },
    {
      label: bookingMeetingConfig.label,
      value: bookingMeetingConfig.place,
      note: bookingMeetingConfig.instructionsNote,
    },
    {
      label: "Guests",
      value: `${guests} ${guests === 1 ? "guest" : "guests"}`,
      changeLabel: "Change guests",
      onChange: onChangeGuests,
    },
    {
      label: "Experience",
      value: bookingPrototypeTour.experienceName,
    },
    {
      label: "Group Size",
      value: bookingCapacityConfig.groupSizeLabel,
    },
    {
      label: "Duration",
      value: bookingPrototypeTour.durationLabel,
    },
  );

  return (
    <section
      className="book-cruise-day book-checkout-enter"
      aria-labelledby="cruise-day-heading"
    >
      <header className="mb-8 max-w-xl space-y-2 sm:mb-9">
        <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--book-gold)] uppercase">
          Your booking
        </p>
        <h3
          id="cruise-day-heading"
          className="book-display text-3xl font-medium text-[var(--book-ink)] sm:text-4xl"
        >
          {heading}
        </h3>
      </header>

      <dl className="divide-y divide-[var(--book-line)]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 py-5 first:pt-0 sm:grid-cols-[11rem_1fr] sm:gap-6"
          >
            <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px] tracking-wide text-[var(--book-muted)]">
              <span>{row.label}</span>
              {row.onChange && row.changeLabel ? (
                <SummaryChangeButton
                  label={row.changeLabel}
                  onClick={row.onChange}
                />
              ) : null}
            </dt>
            <dd
              className={
                row.label === "Cruise Ship"
                  ? "book-display text-[1.35rem] font-medium leading-snug text-[var(--book-ink)] sm:text-[1.5rem]"
                  : "text-[17px] font-medium leading-snug text-[var(--book-ink)] sm:text-lg"
              }
            >
              {row.value}
              {row.note ? (
                <span
                  className={
                    row.label === "Cruise Ship"
                      ? "mt-1.5 block font-sans text-sm font-normal leading-relaxed text-[var(--book-muted)]"
                      : "mt-1.5 block text-sm font-normal leading-relaxed text-[var(--book-muted)]"
                  }
                >
                  {row.note}
                </span>
              ) : null}
            </dd>
          </div>
        ))}

        <div className="grid gap-1 py-6 sm:grid-cols-[11rem_1fr] sm:gap-6">
          <dt className="text-[13px] tracking-wide text-[var(--book-muted)]">
            Total
          </dt>
          <dd className="book-display text-4xl font-medium text-[var(--book-ink)] sm:text-5xl">
            {total}
          </dd>
        </div>
      </dl>
    </section>
  );
}
