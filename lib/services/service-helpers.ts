import type { ReservationExtraction } from "../domain";
import { ValidationError } from "./errors";

export function getNow(now?: Date): Date {
  return now ?? new Date();
}

export function normalizeTags(tags?: string[]): string[] {
  if (!tags || tags.length === 0) {
    return [];
  }

  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
}

export function assertNonEmpty(value: string, fieldName: string): void {
  if (!value.trim()) {
    throw new ValidationError(`${fieldName} is required.`);
  }
}

export function assertDateRange(checkIn?: string | null, checkOut?: string | null): void {
  if (!checkIn || !checkOut) {
    return;
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new ValidationError("Invalid reservation date range.");
  }

  if (end <= start) {
    throw new ValidationError("Check-out must be later than check-in.");
  }
}

export function mergeExtraction(
  current: ReservationExtraction,
  next: Partial<ReservationExtraction>,
): ReservationExtraction {
  return {
    checkIn: next.checkIn ?? current.checkIn,
    checkOut: next.checkOut ?? current.checkOut,
    guestCount: next.guestCount ?? current.guestCount,
    childCount: next.childCount ?? current.childCount,
    roomType: next.roomType ?? current.roomType,
    budget: next.budget ?? current.budget,
    name: next.name ?? current.name,
    email: next.email ?? current.email,
    phone: next.phone ?? current.phone,
    language: next.language ?? current.language,
  };
}
