import type { AssistantConfig, KnowledgeBaseEntry } from "../../domain";
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
    return {
      type: "offer",
      message:
        "Thank you. I now have enough information to prepare a reservation draft and share the best available option.",
      recommendedAction: action,
      referencedKnowledgeBase: matches.map((entry) => entry.title),
      confidence: 0.88,
    };
  }

  return buildIntentReply(input.intent);
}
