import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { Engine } from "@/components/Engine";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });

const title = "The Hour Index — a design system for a café city that changes with the hour";
const description =
  "A self-initiated design project: an invented harbour city of six cafés, designed as a living system whose colour, type and mood follow the time of day."

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#F6E3D3", colorScheme: "light dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
        <Engine />
        {children}
      </body>
    </html>
  );
}
