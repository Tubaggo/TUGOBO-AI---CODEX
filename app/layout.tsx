import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
