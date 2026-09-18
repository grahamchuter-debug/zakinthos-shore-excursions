import { Cormorant_Garamond, Outfit } from "next/font/google";

const bookingDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-booking-display",
  weight: ["400", "500", "600", "700"],
});

const bookingSans = Outfit({
  subsets: ["latin"],
  variable: "--font-booking-sans",
  weight: ["300", "400", "500", "600"],
});

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${bookingDisplay.variable} ${bookingSans.variable} booking-engine-root flex min-h-full flex-1 flex-col`}
    >
      {children}
    </div>
  );
}
