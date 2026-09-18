import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema, travelAgencySchema } from "@/lib/schema";
import { SITE } from "@/lib/site";
import { siteImages } from "@/lib/images";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  icons: {
    icon: [
      { url: "/favicon-16.svg", type: "image/svg+xml", sizes: "16x16" },
      { url: "/favicon-32.svg", type: "image/svg+xml", sizes: "32x32" },
      { url: "/images/logo-mark.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/images/logo-mark.svg" }],
  },
  openGraph: {
    images: [{ url: siteImages.ogDefault.src, width: 1200, height: 630, alt: siteImages.ogDefault.alt }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${sourceSans.variable} ${fraunces.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <JsonLd data={[organizationSchema(), websiteSchema(), travelAgencySchema()]} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
