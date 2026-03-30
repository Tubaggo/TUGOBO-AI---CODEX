import type { AssistantConfig, ConversationThread, KnowledgeBaseEntry, Lead } from "../../domain/types";
import type { AvailabilityPricingResult } from "../../pricing/types";

export type AiDetectedIntent =
  | "reservation_request"
  | "availability_check"
  | "price_request"
  | "room_preference"
  | "property_info"
  | "cancellation_change"
  | "human_handoff"
  | "other";

export type MissingInfoField =
  | "guest_name"
  | "phone"
  | "email"
  | "language"
  | "check_in"
  | "check_out"
  | "guest_count"
  | "child_count"
  | "room_type_preference"
  | "budget"
  | "special_requests";

export type AiLeadQualificationStatus =
  | "new"
  | "qualified"
  | "offer_ready"
  | "handoff_required"
  | "lost";

export type AiRecommendedAction =
  | "ask_missing_information"
  | "prepare_offer"
  | "create_reservation_draft"
  | "handoff_to_human"
  | "answer_property_question"
  | "wait_for_guest_reply";

export interface ExtractedReservationEntities {
  guestName: string | null;
  phone: string | null;
  email: string | null;
  language: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guestCount: number | null;
  childCount: number | null;
  roomTypePreference: string | null;
  budget: number | null;
  specialRequests: string[];
}

export interface MissingInformationResult {
  requiredFields: MissingInfoField[];
  missingFields: MissingInfoField[];
  isComplete: boolean;
  completionRatio: number;
}

export interface LeadScoreFactor {
  label: string;
  points: number;
  reason: string;
}

export interface LeadScoreResult {
  score: number;
  readiness: "low" | "medium" | "high";
  factors: LeadScoreFactor[];
}

export interface AssistantReplySuggestion {
  type: "offer" | "clarification" | "handoff" | "follow_up";
  message: string;
  recommendedAction: AiRecommendedAction;
  referencedKnowledgeBase: string[];
  confidence: number;
}

export interface ReservationDraftSuggestion {
  linkedLeadId: string | null;
  candidateRoomType: string | null;
  suggestedStayDates: {
    checkIn: string | null;
    checkOut: string | null;
  };
  guestCount: number | null;
  estimatedPrice: number | null;
  currency: string;
  notes: string;
  confidence: number;
}

export interface AiLeadUpdateSuggestion {
  createOrUpdate: "create" | "update";
  fields: Partial<Lead>;
}

export interface AiReservationProcessingContext {
  thread: ConversationThread;
  assistantConfig: AssistantConfig;
  knowledgeBase: KnowledgeBaseEntry[];
  currentLead: Lead | null;
  now: Date;
}

export interface AiReservationProcessingResult {
  normalizedGuestMessage: string;
  intent: AiDetectedIntent;
  entities: ExtractedReservationEntities;
  missingInfo: MissingInformationResult;
  leadScore: LeadScoreResult;
  qualification: AiLeadQualificationStatus;
  nextAction: AiRecommendedAction;
  availabilityPricing: AvailabilityPricingResult | null;
  replySuggestion: AssistantReplySuggestion;
  leadUpdateSuggestion: AiLeadUpdateSuggestion;
  reservationDraftSuggestion: ReservationDraftSuggestion | null;
}

export interface ReservationBrain {
  process(input: AiReservationProcessingContext): AiReservationProcessingResult;
}
