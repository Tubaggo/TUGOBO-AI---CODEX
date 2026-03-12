import type { Metadata } from "next";
import { Instrument_Sans, Manrope } from "next/font/google";

import "@/app/globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Tugobo AI",
  description: "Sales-ready demo for an AI reservation assistant built for hotels and accommodation businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}
