import type { AssistantConfig, KnowledgeBaseEntry } from "../../domain";
import type { AvailabilityPricingResult } from "../../pricing";
import type {
  AiDetectedIntent,
  AiLeadQualificationStatus,
  AiRecommendedAction,
  AssistantReplySuggestion,
  ExtractedReservationEntities,
  MissingInformationResult,
} from "../types/ai-reservation.types";
import { buildFollowUpReply, buildIntentReply } from "./reply-templates";

function getKnowledgeMatches(intent: AiDetectedIntent, knowledgeBase: KnowledgeBaseEntry[]): KnowledgeBaseEntry[] {
  if (intent === "property_info") {
    return knowledgeBase.filter((entry) =>
      ["amenities", "checkin_checkout", "general"].includes(entry.category),
    );
  }

  if (intent === "room_preference") {
    return knowledgeBase.filter((entry) => entry.category === "room_info");
  }

  return [];
}

function decideAction(input: {
  qualification: AiLeadQualificationStatus;
  intent: AiDetectedIntent;
  missingInfo: MissingInformationResult;
}): AiRecommendedAction {
  if (input.qualification === "handoff_required") {
    return "handoff_to_human";
  }

  if (!input.missingInfo.isComplete) {
    return "ask_missing_information";
  }

  if (input.qualification === "offer_ready") {
    return "create_reservation_draft";
  }

  if (input.intent === "property_info") {
    return "answer_property_question";
  }

  return "prepare_offer";
}

export function generateReply(input: {
  intent: AiDetectedIntent;
  entities: ExtractedReservationEntities;
  missingInfo: MissingInformationResult;
  qualification: AiLeadQualificationStatus;
  assistantConfig: AssistantConfig;
  knowledgeBase: KnowledgeBaseEntry[];
  availabilityPricing: AvailabilityPricingResult | null;
}): AssistantReplySuggestion {
  const action = decideAction({
    qualification: input.qualification,
    intent: input.intent,
    missingInfo: input.missingInfo,
  });

  if (action === "handoff_to_human") {
    return {
      type: "handoff",
      message:
        input.assistantConfig.fallbackMessage ??
        "I will connect you with our reservation team for further assistance.",
      recommendedAction: action,
      referencedKnowledgeBase: [],
      confidence: 0.95,
    };
  }

  if (action === "ask_missing_information") {
    return buildFollowUpReply(input.missingInfo.missingFields);
  }

  const matches = getKnowledgeMatches(input.intent, input.knowledgeBase).slice(0, 2);

  if (action === "answer_property_question" && matches.length > 0) {
    return {
      type: "follow_up",
      message: `Here is the most relevant information for your question: ${matches
        .map((entry) => entry.content)
        .join(" ")}`,
      recommendedAction: action,
      referencedKnowledgeBase: matches.map((entry) => entry.title),
      confidence: 0.83,
    };
  }

  if (action === "create_reservation_draft") {
    const suggestedRoom = input.availabilityPricing?.suggestedBestFit?.roomType.name ?? "our best available room";
    const estimatedTotal = input.availabilityPricing?.estimatedTotalPrice;
    const fallbackRoom = input.availabilityPricing?.fallbackOption?.roomType.name ?? null;
    const fallbackCase = Boolean(input.availabilityPricing?.reasonIfUnavailable && fallbackRoom);
    const childNote =
      typeof input.entities.childCount === "number" && input.entities.childCount > 0
        ? ` I will prioritize ${suggestedRoom} because it is better suited for children and family comfort.`
        : "";

    return {
      type: "offer",
      message: fallbackCase
        ? `Thank you. Your preferred room is no longer available for those dates, but ${fallbackRoom} would still be a very good option.${estimatedTotal ? ` The current total comes to around ${estimatedTotal} EUR.` : ""} If you like, I can prepare it for you now.`
        : `Lovely, I can now prepare a reservation draft for ${suggestedRoom}.${estimatedTotal ? ` The current total comes to around ${estimatedTotal} EUR.` : ""}${childNote} If you would like to move forward, I can get everything ready now.`,
      recommendedAction: action,
      referencedKnowledgeBase: matches.map((entry) => entry.title),
      confidence: fallbackCase
        ? 0.76
        : typeof input.entities.childCount === "number" && input.entities.childCount > 0
          ? 0.91
          : 0.94,
    };
  }

  if (action === "prepare_offer" && input.availabilityPricing?.suggestedBestFit) {
    const suggestedRoom = input.availabilityPricing.suggestedBestFit.roomType.name;
    const estimatedTotal = input.availabilityPricing.estimatedTotalPrice;
    const fallbackRoom = input.availabilityPricing.fallbackOption?.roomType.name ?? null;

    return {
      type: "offer",
      message:
        input.availabilityPricing.reasonIfUnavailable && fallbackRoom
          ? `The room you asked for is in very short supply, although ${fallbackRoom} is still available and would keep the stay comfortable.${estimatedTotal ? ` The total would be around ${estimatedTotal} EUR.` : ""} If it suits you, I can hold the next step for you now.`
          : `${suggestedRoom} would be a lovely fit for this stay.${estimatedTotal ? ` The total would be around ${estimatedTotal} EUR.` : ""} If you would like, I can prepare the next step for you.`,
      recommendedAction: action,
      referencedKnowledgeBase: matches.map((entry) => entry.title),
      confidence:
        input.availabilityPricing.reasonIfUnavailable && fallbackRoom
          ? 0.74
          : typeof input.entities.childCount === "number" && input.entities.childCount > 0
            ? 0.9
            : 0.93,
    };
  }

  return buildIntentReply(input.intent);
}
