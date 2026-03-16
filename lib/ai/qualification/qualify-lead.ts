import type {
  AiDetectedIntent,
  AiLeadQualificationStatus,
  ExtractedReservationEntities,
  LeadScoreResult,
  MissingInformationResult,
} from "../types/ai-reservation.types";

export function qualifyLead(input: {
  intent: AiDetectedIntent;
  entities: ExtractedReservationEntities;
  missingInfo: MissingInformationResult;
  leadScore: LeadScoreResult;
}): AiLeadQualificationStatus {
  if (input.intent === "human_handoff" || (input.entities.guestCount ?? 0) >= 5) {
    return "handoff_required";
  }

  if (input.intent === "cancellation_change") {
    return "handoff_required";
  }

  if (input.missingInfo.isComplete && input.leadScore.score >= 75) {
    return "offer_ready";
  }

  if (input.leadScore.score >= 50 && input.entities.checkIn && input.entities.checkOut) {
    return "qualified";
  }

  return "new";
}
