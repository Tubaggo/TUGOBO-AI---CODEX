import type { ReservationExtraction } from "../domain";

const DATE_RANGE_PATTERN =
  /(?:from|between|giris|giriş)\s+([a-z0-9/\-. ]+?)\s+(?:to|and|cikis|çıkış)\s+([a-z0-9/\-. ]+?)(?:\s|$)/i;
const GUEST_COUNT_PATTERN = /(\d+)\s*(?:adult|adults|guest|guests|people|person|kisi|kişi)/i;
const CHILD_COUNT_PATTERN = /(\d+)\s*(?:child|children|kid|kids|cocuk|çocuk)/i;
const EMAIL_PATTERN = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i;
const PHONE_PATTERN = /(\+?\d[\d\s-]{8,}\d)/;
const BUDGET_PATTERN = /(?:budget|around|about|under|eur|€)\s*[:=]?\s*(\d{2,5})/i;
const ROOM_TYPE_PATTERN =
  /(villa|bungalow|suite|deluxe|sea view|family room|family villa|standard room)/i;

function toIsoDate(input: string): string | null {
  const date = new Date(input.trim());
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function extractLeadDataFromMessage(content: string): Partial<ReservationExtraction> {
  const extraction: Partial<ReservationExtraction> = {};

  const normalized = content.trim();
  const dateRange = normalized.match(DATE_RANGE_PATTERN);
  const guests = normalized.match(GUEST_COUNT_PATTERN);
  const children = normalized.match(CHILD_COUNT_PATTERN);
  const email = normalized.match(EMAIL_PATTERN);
  const phone = normalized.match(PHONE_PATTERN);
  const budget = normalized.match(BUDGET_PATTERN);
  const roomType = normalized.match(ROOM_TYPE_PATTERN);

  if (dateRange) {
    extraction.checkIn = toIsoDate(dateRange[1]);
    extraction.checkOut = toIsoDate(dateRange[2]);
  }

  if (guests) {
    extraction.guestCount = Number(guests[1]);
  }

  if (children) {
    extraction.childCount = Number(children[1]);
  }

  if (email) {
    extraction.email = email[1];
  }

  if (phone) {
    extraction.phone = phone[1].replace(/\s+/g, " ").trim();
  }

  if (budget) {
    extraction.budget = Number(budget[1]);
  }

  if (roomType) {
    extraction.roomType = roomType[1];
  }

  if (/merhaba|tesekkur|rezervasyon|kisi|kişi/i.test(normalized)) {
    extraction.language = "tr";
  } else if (/hello|hi|room|available|price/i.test(normalized)) {
    extraction.language = "en";
  }

  return extraction;
}
