import {bookingCheckoutCopy} from "@/lib/booking/booking-config";
import { useBookingTour } from "@/components/booking-engine/booking-tour-context";

export function BookingReconnectMoment() {
  const bookingPrototypeTour = useBookingTour();
  const tour = bookingPrototypeTour;

  return (
    <section
      className="book-reconnect book-checkout-enter relative overflow-hidden rounded-[1.5rem]"
      aria-label={bookingCheckoutCopy.reconnectLine}
    >
      <div className="book-reconnect-stage absolute inset-0" aria-hidden="true">
        <img
          src={tour.checkoutReconnectImage}
          alt={tour.checkoutReconnectImageAlt || "Zakynthos waterfront and Ionian Sea"}
          width={1920}
          height={1256}
          className="book-reconnect-image h-full w-full object-cover object-center"
          decoding="async"
          loading="lazy"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-r from-[var(--book-ink)]/70 via-[var(--book-ink)]/45 to-[var(--book-ink)]/25"
        aria-hidden="true"
      />
      <div className="relative z-10 flex min-h-[9.5rem] items-end px-6 py-8 sm:min-h-[11rem] sm:px-10 sm:py-10">
        <p className="book-display max-w-xl text-2xl font-medium leading-snug text-white sm:text-3xl">
          {bookingCheckoutCopy.reconnectLine}
        </p>
      </div>
    </section>
  );
}
