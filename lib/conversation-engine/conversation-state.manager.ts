import type {
  ConversationIntent,
  ConversationStatus,
  ReservationExtraction,
} from "../domain";
import type { UpdateConversationInput } from "../services";

type StateInput = {
  messageSenderType: "guest" | "assistant" | "human" | "system";
  previousStatus: ConversationStatus;
  previousIntent: ConversationIntent | null;
  extracted: Partial<ReservationExtraction>;
};

function resolveIntent(
  previousIntent: ConversationIntent | null,
  extracted: Partial<ReservationExtraction>,
): ConversationIntent | null {
  if (extracted.checkIn || extracted.checkOut) {
    return previousIntent ?? "reservation_request";
  }

  if (typeof extracted.budget === "number") {
    return "price_request";
  }

  if (extracted.roomType) {
    return previousIntent ?? "availability_check";
  }

  return previousIntent;
}

export function resolveConversationState(input: StateInput): Pick<
  UpdateConversationInput,
  "status" | "intent" | "humanHandoff" | "aiEnabled"
> {
  if (input.messageSenderType === "guest") {
    return {
      status: "open",
      intent: resolveIntent(input.previousIntent, input.extracted),
      humanHandoff: input.previousStatus === "human_handling",
      aiEnabled: input.previousStatus !== "human_handling",
    };
  }

  if (input.messageSenderType === "human") {
    return {
      status: "human_handling",
      intent: input.previousIntent,
      humanHandoff: true,
      aiEnabled: false,
    };
  }

  if (input.messageSenderType === "assistant") {
    return {
      status: input.previousStatus === "resolved" ? "resolved" : "waiting",
      intent: input.previousIntent,
      humanHandoff: input.previousStatus === "human_handling",
      aiEnabled: input.previousStatus !== "human_handling",
    };
  }

  return {
    status: input.previousStatus,
    intent: input.previousIntent,
    humanHandoff: input.previousStatus === "human_handling",
    aiEnabled: input.previousStatus !== "human_handling",
  };
}
