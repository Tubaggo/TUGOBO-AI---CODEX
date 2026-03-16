import type { ExtractedReservationEntities } from "../types/ai-reservation.types";

const EMAIL_PATTERN = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i;
const PHONE_PATTERN = /(\+?\d[\d\s-]{8,}\d)/;
const DATE_RANGE_PATTERN =
  /(?:from|between|check[- ]?in|giris|giriş)\s+([a-z0-9/\-. ]+?)\s+(?:to|and|check[- ]?out|cikis|çıkış)\s+([a-z0-9/\-. ]+?)(?:\s|$)/i;
const GUEST_PATTERN = /(\d+)\s*(?:adult|adults|guest|guests|people|person|kisi|kişi)/i;
const CHILD_PATTERN = /(\d+)\s*(?:child|children|kid|kids|cocuk|çocuk)/i;
const BUDGET_PATTERN = /(?:budget|around|about|under|eur|€)\s*[:=]?\s*(\d{2,5})/i;
const ROOM_PATTERN =
  /(family villa|deluxe sea view room|riverfront bungalow|villa|bungalow|suite|sea view room|family room)/i;
const NAME_PATTERN = /(?:my name is|this is|i am)\s+([a-z]+(?:\s[a-z]+){0,2})/i;

function parseDate(value: string): string | null {
  const parsed = new Date(value.trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function detectSpecialRequests(message: string): string[] {
  const requests: string[] = [];
  const patterns = [
    { pattern: /airport transfer/i, value: "airport transfer" },
    { pattern: /late check[- ]?in/i, value: "late check-in" },
    { pattern: /quiet room/i, value: "quiet room" },
    { pattern: /baby cot/i, value: "baby cot" },
    { pattern: /high floor/i, value: "high floor" },
  ];

  for (const entry of patterns) {
    if (entry.pattern.test(message)) {
      requests.push(entry.value);
    }
  }

  return requests;
}

export function extractReservationEntities(message: string): ExtractedReservationEntities {
  const dateRange = message.match(DATE_RANGE_PATTERN);
  const guestCount = message.match(GUEST_PATTERN);
  const childCount = message.match(CHILD_PATTERN);
  const email = message.match(EMAIL_PATTERN);
  const phone = message.match(PHONE_PATTERN);
  const budget = message.match(BUDGET_PATTERN);
  const roomType = message.match(ROOM_PATTERN);
  const name = message.match(NAME_PATTERN);

  return {
    guestName: name ? name[1].trim() : null,
    phone: phone ? phone[1].replace(/\s+/g, " ").trim() : null,
    email: email ? email[1].trim() : null,
    language: /merhaba|rezervasyon|fiyat|kisi|kişi/i.test(message) ? "tr" : "en",
    checkIn: dateRange ? parseDate(dateRange[1]) : null,
    checkOut: dateRange ? parseDate(dateRange[2]) : null,
    guestCount: guestCount ? Number(guestCount[1]) : null,
    childCount: childCount ? Number(childCount[1]) : null,
    roomTypePreference: roomType ? roomType[1].trim() : null,
    budget: budget ? Number(budget[1]) : null,
    specialRequests: detectSpecialRequests(message),
  };
}
