import type {
  AiLeadQualificationStatus,
  ExtractedReservationEntities,
  ReservationDraftSuggestion,
} from "../types/ai-reservation.types";
import type { Lead } from "../../domain";
import type { AvailabilityPricingResult } from "../../pricing";

export function createDraftSuggestion(input: {
  qualification: AiLeadQualificationStatus;
  entities: ExtractedReservationEntities;
  currentLead: Lead | null;
  leadScore: number;
  availabilityPricing: AvailabilityPricingResult | null;
}): ReservationDraftSuggestion | null {
  if (!["qualified", "offer_ready"].includes(input.qualification)) {
    return null;
  }

  const roomType =
    input.availabilityPricing?.suggestedBestFit?.roomType.name ??
    input.entities.roomTypePreference ??
    input.currentLead?.roomTypePreference ??
    "Best available matched room";
  const estimatedPrice =
    input.availabilityPricing?.estimatedTotalPrice ?? input.currentLead?.estimatedValue ?? null;

  return {
    linkedLeadId: input.currentLead?.id ?? null,
    candidateRoomType: roomType,
    suggestedStayDates: {
      checkIn: input.entities.checkIn,
      checkOut: input.entities.checkOut,
    },
    guestCount: input.entities.guestCount,
    estimatedPrice,
    currency: input.currentLead?.currency ?? "EUR",
    notes: input.availabilityPricing?.pricingNote
      ? `${input.availabilityPricing.pricingNote}${
          input.entities.specialRequests.length > 0
            ? ` Special requests: ${input.entities.specialRequests.join(", ")}`
            : ""
        }`
      : input.entities.specialRequests.length > 0
        ? `Special requests: ${input.entities.specialRequests.join(", ")}`
        : "Draft prepared from qualified conversation data.",
    confidence: Number(Math.min(0.98, Math.max(0.35, input.leadScore / 100)).toFixed(2)),
  };
}
