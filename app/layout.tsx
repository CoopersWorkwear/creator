import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { business } from "./lib/business";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://berwickmechanicalservices.com.au"),
  title: {
    default: `${business.name} | Mechanic & Roadworthy in Berwick`,
    template: `%s | ${business.name}`,
  },
  description:
    "Berwick Mechanical Services — VicRoads accredited mechanics serving Berwick since 2003. Log book servicing, roadworthy certificates, brakes, clutches, suspension and general repairs for all makes and models.",
  keywords: [
    "mechanic Berwick",
    "roadworthy Berwick",
    "RWC Berwick",
    "log book service Berwick",
    "car service Berwick",
    "VicRoads accredited tester Berwick",
  ],
  openGraph: {
    title: `${business.name} | Mechanic & Roadworthy in Berwick`,
    description:
      "VicRoads accredited mechanics serving Berwick since 2003. Servicing, roadworthy certificates, brakes, clutches, suspension and general repairs for all makes and models.",
    type: "website",
    locale: "en_AU",
    url: "https://berwickmechanicalservices.com.au",
    siteName: business.name,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: business.name,
  description: business.blurb,
  telephone: business.phone,
  email: business.email,
  url: "https://berwickmechanicalservices.com.au",
  foundingDate: String(business.established),
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.line1,
    addressLocality: business.address.suburb,
    addressRegion: business.address.state,
    postalCode: business.address.postcode,
    addressCountry: "AU",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:30",
    },
  ],
  areaServed: ["Berwick", "Beaconsfield", "Officer", "Pakenham", "Narre Warren", "Clyde"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body className={`${inter.variable} ${oswald.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
