import type {
  AiReservationProcessingContext,
  AiReservationProcessingResult,
  ReservationBrain,
} from "../types/ai-reservation.types";
import { processConversation } from "./process-conversation";

export class TugoboReservationBrain implements ReservationBrain {
  process(input: AiReservationProcessingContext): AiReservationProcessingResult {
    return processConversation(input);
  }
}
