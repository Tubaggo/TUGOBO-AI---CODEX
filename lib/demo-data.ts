export type DemoMessage = {
  id: string;
  sender: "guest" | "assistant";
  body: string;
  time: string;
};

export type LeadDraft = {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  channel: "WhatsApp" | "Website Chat" | "Instagram";
  roomPreference: string;
  notes: string;
  status: "new" | "qualified" | "proposal ready";
};

export type BusinessSettings = {
  businessName: string;
  city: string;
  country: string;
  propertyType: string;
  responseLanguage: string;
  contactNumber: string;
  tone: string;
  checkInWindow: string;
  checkOutWindow: string;
  roomTypes: string[];
  policies: string[];
};

export const demoBusiness: BusinessSettings = {
  businessName: "Sea Breeze Bodrum",
  city: "Bodrum",
  country: "Turkey",
  propertyType: "Boutique Hotel",
  responseLanguage: "English, Turkish, German",
  contactNumber: "+90 555 201 44 18",
  tone: "Warm, premium, and concise",
  checkInWindow: "14:00 onwards",
  checkOutWindow: "Until 12:00",
  roomTypes: ["Deluxe Sea View", "Signature Terrace", "Family Terrace"],
  policies: [
    "Free cancellation up to 72 hours before check-in for flexible rates.",
    "Airport transfer can be added with at least 12 hours notice.",
    "Early check-in is subject to availability on arrival day.",
  ],
};

export const landingStats = [
  { label: "First reply", value: "<10 sec" },
  { label: "Direct inquiries handled", value: "24/7" },
  { label: "Setup time for demo", value: "1 day" },
];

export const leadDraft: LeadDraft = {
  id: "lead-1001",
  guestName: "Amelia Carter",
  email: "amelia.carter@example.com",
  phone: "+44 7700 900123",
  checkIn: "2026-04-18",
  checkOut: "2026-04-22",
  guests: "2 adults",
  channel: "WhatsApp",
  roomPreference: "Deluxe Sea View with breakfast",
  notes: "Interested in airport transfer and a refundable offer.",
  status: "proposal ready",
};

export const reservationLeads: LeadDraft[] = [
  leadDraft,
  {
    id: "lead-1002",
    guestName: "Nadia Rahman",
    email: "nadia.rahman@example.com",
    phone: "+971 50 302 4418",
    checkIn: "2026-06-10",
    checkOut: "2026-06-13",
    guests: "2 adults",
    channel: "Website Chat",
    roomPreference: "Panorama Suite",
    notes: "Interested in anniversary package.",
    status: "qualified",
  },
  {
    id: "lead-1003",
    guestName: "Luca Bianchi",
    email: "Pending from DM",
    phone: "Pending from Instagram",
    checkIn: "2026-05-02",
    checkOut: "2026-05-05",
    guests: "2 adults, 1 child",
    channel: "Instagram",
    roomPreference: "Family Terrace",
    notes: "Waiting for final approval on child bedding setup.",
    status: "new",
  },
];

export const whatsappScript: DemoMessage[] = [
  {
    id: "m1",
    sender: "guest",
    body: "Hi, I'm Amelia. Do you have a sea-view room for April 18 to 22 for two adults?",
    time: "10:12",
  },
  {
    id: "m2",
    sender: "assistant",
    body: "Yes, Amelia. I can help with that. I noted April 18 to 22 for 2 adults. Would you like breakfast included and a refundable rate?",
    time: "10:12",
  },
  {
    id: "m3",
    sender: "guest",
    body: "Yes please. My email is amelia.carter@example.com and yes, can you arrange airport transfer?",
    time: "10:13",
  },
  {
    id: "m4",
    sender: "assistant",
    body: "Absolutely. I captured your name, dates, guest count, and contact details. I can now prepare a Deluxe Sea View offer with breakfast and transfer and share it with the hotel team.",
    time: "10:13",
  },
];

export const simulationReplies = [
  "Ask for breakfast included",
  "Add airport transfer",
  "Request a refundable rate",
];
