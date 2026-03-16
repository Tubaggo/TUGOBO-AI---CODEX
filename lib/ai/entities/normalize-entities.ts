import type { ExtractedReservationEntities } from "../types/ai-reservation.types";

function titleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function normalizeEntities(
  entities: ExtractedReservationEntities,
): ExtractedReservationEntities {
  return {
    ...entities,
    guestName: entities.guestName ? titleCase(entities.guestName) : null,
    email: entities.email ? entities.email.toLowerCase() : null,
    phone: entities.phone ? entities.phone.replace(/\s+/g, " ").trim() : null,
    roomTypePreference: entities.roomTypePreference ? titleCase(entities.roomTypePreference) : null,
    specialRequests: [...new Set(entities.specialRequests.map((request) => request.trim()).filter(Boolean))],
  };
}
