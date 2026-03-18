import type { Lead } from "../../domain";
import { detectIntent } from "../intent/detect-intent";
import { extractReservationEntities } from "../entities/extract-reservation-entities";
import { normalizeEntities } from "../entities/normalize-entities";
import { evaluateMissingInformation } from "./evaluate-missing-info";
import { scoreLead } from "../qualification/score-lead";
import { qualifyLead } from "../qualification/qualify-lead";
import { generateReply } from "../reply/generate-reply";
import { createDraftSuggestion } from "../reservation/create-draft-suggestion";
import { suggestRoomOptions } from "../../pricing";
import type {
  AiReservationProcessingContext,
  AiReservationProcessingResult,
  ExtractedReservationEntities,
} from "../types/ai-reservation.types";

function getLatestGuestMessage(thread: AiReservationProcessingContext["thread"]): string {
  const guestMessages = thread.messages.filter((message) => message.senderType === "guest");
  return guestMessages.at(-1)?.content ?? "";
}

function mergeWithLead(
  extracted: ExtractedReservationEntities,
  lead: Lead | null,
  thread: AiReservationProcessingContext["thread"],
): ExtractedReservationEntities {
  return {
    guestName: extracted.guestName ?? lead?.fullName ?? thread.conversation.guestName ?? null,
    phone: extracted.phone ?? lead?.phone ?? thread.conversation.guestPhone ?? null,
    email: extracted.email ?? lead?.email ?? thread.conversation.guestEmail ?? null,
    language: extracted.language ?? lead?.language ?? thread.conversation.guestLanguage ?? null,
    checkIn: extracted.checkIn ?? lead?.checkIn ?? null,
    checkOut: extracted.checkOut ?? lead?.checkOut ?? null,
    guestCount: extracted.guestCount ?? lead?.guestCount ?? null,
    childCount: extracted.childCount ?? lead?.childCount ?? null,
    roomTypePreference: extracted.roomTypePreference ?? lead?.roomTypePreference ?? null,
    budget: extracted.budget ?? lead?.budget ?? null,
    specialRequests: extracted.specialRequests,
  };
}

function mapQualificationToLeadStatus(
  qualification: AiReservationProcessingResult["qualification"],
): Lead["status"] {
  if (qualification === "offer_ready") {
    return "offer_sent";
  }

  if (qualification === "qualified") {
    return "qualified";
  }

  if (qualification === "lost") {
    return "lost";
  }

  return "new";
}

export function processConversation(
  input: AiReservationProcessingContext,
): AiReservationProcessingResult {
  const latestGuestMessage = getLatestGuestMessage(input.thread);
  const normalizedGuestMessage = latestGuestMessage.trim().replace(/\s+/g, " ");
  const intent = detectIntent(normalizedGuestMessage);
  const extracted = normalizeEntities(extractReservationEntities(normalizedGuestMessage));
  const entities = mergeWithLead(extracted, input.currentLead, input.thread);
  const missingInfo = evaluateMissingInformation(intent, entities);
  const leadScore = scoreLead({ entities, missingInfo });
  const qualification = qualifyLead({ intent, entities, missingInfo, leadScore });
  const availabilityPricing = suggestRoomOptions({
    checkIn: entities.checkIn,
    checkOut: entities.checkOut,
    guestCount: entities.guestCount,
    childCount: entities.childCount,
    roomTypePreference: entities.roomTypePreference,
    budget: entities.budget,
  });
  const replySuggestion = generateReply({
    intent,
    entities,
    missingInfo,
    qualification,
    assistantConfig: input.assistantConfig,
    knowledgeBase: input.knowledgeBase,
    availabilityPricing,
  });
  const reservationDraftSuggestion = createDraftSuggestion({
    qualification,
    entities,
    currentLead: input.currentLead,
    leadScore: leadScore.score,
    availabilityPricing,
  });

  return {
    normalizedGuestMessage,
    intent,
    entities,
    missingInfo,
    leadScore,
    qualification,
    nextAction: replySuggestion.recommendedAction,
    availabilityPricing,
    replySuggestion,
    leadUpdateSuggestion: {
      createOrUpdate: input.currentLead ? "update" : "create",
      fields: {
        fullName: entities.guestName,
        phone: entities.phone,
        email: entities.email,
        language: entities.language,
        checkIn: entities.checkIn,
        checkOut: entities.checkOut,
        guestCount: entities.guestCount,
        childCount: entities.childCount,
        roomTypePreference:
          availabilityPricing?.suggestedBestFit?.roomType.name ?? entities.roomTypePreference,
        budget: entities.budget,
        status: mapQualificationToLeadStatus(qualification),
        estimatedValue:
          availabilityPricing?.estimatedTotalPrice ??
          reservationDraftSuggestion?.estimatedPrice ??
          input.currentLead?.estimatedValue ??
          null,
      },
    },
    reservationDraftSuggestion,
  };
}
