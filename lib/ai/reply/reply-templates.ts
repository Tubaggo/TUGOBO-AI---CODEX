import type {
  AiDetectedIntent,
  AssistantReplySuggestion,
  MissingInfoField,
} from "../types/ai-reservation.types";

function fieldPrompt(field: MissingInfoField): string {
  switch (field) {
    case "check_in":
      return "your preferred check-in date";
    case "check_out":
      return "your check-out date";
    case "guest_count":
      return "the total number of guests";
    case "room_type_preference":
      return "your preferred room type";
    case "guest_name":
      return "the guest name for the booking";
    case "phone":
      return "a phone number";
    case "email":
      return "an email address";
    case "budget":
      return "your approximate budget";
    case "special_requests":
      return "any special requests";
    case "language":
      return "your preferred language";
    case "child_count":
      return "the number of children";
    default:
      return field;
  }
}

export function buildFollowUpReply(missingFields: MissingInfoField[]): AssistantReplySuggestion {
  const prompts = missingFields.map(fieldPrompt);
  const sentence =
    prompts.length === 1
      ? prompts[0]
      : `${prompts.slice(0, -1).join(", ")} and ${prompts[prompts.length - 1]}`;

  return {
    type: "clarification",
    message: `I'd love to help you plan this stay. Could you send me ${sentence} so I can suggest the best option for you?`,
    recommendedAction: "ask_missing_information",
    referencedKnowledgeBase: [],
    confidence: 0.92,
  };
}

export function buildIntentReply(intent: AiDetectedIntent): AssistantReplySuggestion {
  if (intent === "human_handoff" || intent === "cancellation_change") {
    return {
      type: "handoff",
      message: "I'm bringing in our reservations team so they can take great care of this for you.",
      recommendedAction: "handoff_to_human",
      referencedKnowledgeBase: [],
      confidence: 0.95,
    };
  }

  return {
    type: "follow_up",
    message: "Thanks for reaching out. I'll put together the best next step for your stay and guide you from there.",
    recommendedAction: "wait_for_guest_reply",
    referencedKnowledgeBase: [],
    confidence: 0.72,
  };
}
