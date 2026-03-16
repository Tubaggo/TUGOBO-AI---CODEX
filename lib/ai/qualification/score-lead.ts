import type {
  ExtractedReservationEntities,
  LeadScoreResult,
  MissingInformationResult,
} from "../types/ai-reservation.types";

export function scoreLead(input: {
  entities: ExtractedReservationEntities;
  missingInfo: MissingInformationResult;
}): LeadScoreResult {
  const factors = [];
  let score = 0;

  if (input.entities.checkIn && input.entities.checkOut) {
    score += 30;
    factors.push({ label: "Travel Dates", points: 30, reason: "Both stay dates are available." });
  }

  if (input.entities.guestCount) {
    score += 20;
    factors.push({ label: "Guest Count", points: 20, reason: "Guest count is known." });
  }

  if (input.entities.roomTypePreference) {
    score += 10;
    factors.push({ label: "Room Preference", points: 10, reason: "Preferred room type is captured." });
  }

  if (typeof input.entities.budget === "number") {
    score += 10;
    factors.push({ label: "Budget", points: 10, reason: "Budget helps prepare the right offer." });
  }

  if (input.entities.phone || input.entities.email) {
    score += 10;
    factors.push({ label: "Contactability", points: 10, reason: "Contact details are available." });
  }

  if (input.entities.specialRequests.length > 0) {
    score += 5;
    factors.push({ label: "Special Requests", points: 5, reason: "Guest preferences are clearer." });
  }

  score += Math.round(input.missingInfo.completionRatio * 15);
  factors.push({
    label: "Completeness",
    points: Math.round(input.missingInfo.completionRatio * 15),
    reason: "Required reservation data completeness.",
  });

  const readiness = score >= 75 ? "high" : score >= 45 ? "medium" : "low";

  return {
    score,
    readiness,
    factors,
  };
}
