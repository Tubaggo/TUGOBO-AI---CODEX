import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tugobo AI | AI Reservation Assistant for Accommodation Businesses",
  description:
    "Tugobo AI helps hotels, boutique properties, villas, and bungalow operators reply instantly on WhatsApp, Instagram DM, and website chat to convert more guest messages into reservations.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
