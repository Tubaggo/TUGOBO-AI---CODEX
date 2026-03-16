import type {
  AiDetectedIntent,
  ExtractedReservationEntities,
  MissingInfoField,
  MissingInformationResult,
} from "../types/ai-reservation.types";

function requiredFieldsByIntent(intent: AiDetectedIntent): MissingInfoField[] {
  switch (intent) {
    case "reservation_request":
    case "availability_check":
    case "price_request":
      return ["check_in", "check_out", "guest_count"];
    case "room_preference":
      return ["check_in", "check_out", "guest_count", "room_type_preference"];
    case "property_info":
      return [];
    case "human_handoff":
      return [];
    case "cancellation_change":
      return ["guest_name"];
    default:
      return ["check_in", "check_out"];
  }
}

export function evaluateMissingInformation(
  intent: AiDetectedIntent,
  entities: ExtractedReservationEntities,
): MissingInformationResult {
  const requiredFields = requiredFieldsByIntent(intent);
  const values: Record<MissingInfoField, unknown> = {
    guest_name: entities.guestName,
    phone: entities.phone,
    email: entities.email,
    language: entities.language,
    check_in: entities.checkIn,
    check_out: entities.checkOut,
    guest_count: entities.guestCount,
    child_count: entities.childCount,
    room_type_preference: entities.roomTypePreference,
    budget: entities.budget,
    special_requests: entities.specialRequests.length > 0 ? entities.specialRequests : null,
  };

  const missingFields = requiredFields.filter((field) => !values[field]);

  return {
    requiredFields,
    missingFields,
    isComplete: missingFields.length === 0,
    completionRatio:
      requiredFields.length === 0
        ? 1
        : Number(((requiredFields.length - missingFields.length) / requiredFields.length).toFixed(2)),
  };
}
