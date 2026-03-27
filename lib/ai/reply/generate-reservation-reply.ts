import type { AssistantConfig, ConversationThread } from "../../domain";
import type {
  AiReservationProcessingResult,
  AssistantReplySuggestion,
  MissingInfoField,
} from "../types/ai-reservation.types";

type GenerateReservationReplyInput = {
  thread: ConversationThread;
  aiResult: AiReservationProcessingResult;
  assistantConfig: AssistantConfig;
};

function formatDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function buildGuestReference(name: string | null): string {
  return name ? ` ${name}` : "";
}

function buildStaySummary(input: {
  checkIn: string | null;
  checkOut: string | null;
  guestCount: number | null;
  childCount: number | null;
}): string {
  const parts = [
    input.checkIn && input.checkOut ? `from ${input.checkIn} to ${input.checkOut}` : null,
    input.guestCount ? `for ${input.guestCount} guest${input.guestCount > 1 ? "s" : ""}` : null,
    typeof input.childCount === "number" && input.childCount > 0
      ? `including ${input.childCount} child${input.childCount > 1 ? "ren" : ""}`
      : null,
  ].filter(Boolean);

  return parts.join(" ");
}

function translateField(field: MissingInfoField, language: string | null): string {
  const translations: Record<MissingInfoField, { en: string; tr: string }> = {
    guest_name: { en: "guest name", tr: "misafir adi" },
    phone: { en: "phone number", tr: "telefon numarasi" },
    email: { en: "email address", tr: "e-posta adresi" },
    language: { en: "preferred language", tr: "tercih ettiginiz dil" },
    check_in: { en: "check-in date", tr: "giris tarihi" },
    check_out: { en: "check-out date", tr: "cikis tarihi" },
    guest_count: { en: "number of guests", tr: "misafir sayisi" },
    child_count: { en: "number of children", tr: "cocuk sayisi" },
    room_type_preference: { en: "preferred room type", tr: "oda tercihiniz" },
    budget: { en: "approximate budget", tr: "yaklasik butceniz" },
    special_requests: { en: "special requests", tr: "ozel talepleriniz" },
  };

  return language === "tr" ? translations[field].tr : translations[field].en;
}

function buildMissingInfoReply(input: GenerateReservationReplyInput): AssistantReplySuggestion {
  const language = input.aiResult.entities.language;
  const guestReference = buildGuestReference(
    input.aiResult.entities.guestName ?? input.thread.conversation.guestName,
  );
  const fields = input.aiResult.missingInfo.missingFields.map((field) =>
    translateField(field, language),
  );
  const joined =
    fields.length === 1 ? fields[0] : `${fields.slice(0, -1).join(", ")} and ${fields.at(-1)}`;

  return {
    type: "clarification",
    message:
      language === "tr"
        ? `Merhaba${guestReference}, size en uygun secenegi hazirlayabilmem icin lutfen ${fields.join(", ")} bilgisini paylasir misiniz?`
        : `Hello${guestReference}, I'd be happy to help with your reservation request. To prepare the right option for you, could you please share ${joined}?`,
    recommendedAction: "ask_missing_information",
    referencedKnowledgeBase: [],
    confidence: 0.91,
  };
}

export function generateReservationReply(
  input: GenerateReservationReplyInput,
): AssistantReplySuggestion {
  const { aiResult } = input;
  const language = aiResult.entities.language;
  const guestReference = buildGuestReference(
    aiResult.entities.guestName ?? input.thread.conversation.guestName,
  );

  if (aiResult.missingInfo.missingFields.length > 0) {
    return buildMissingInfoReply(input);
  }

  if (aiResult.intent === "human_handoff" || aiResult.intent === "cancellation_change") {
    return {
      type: "handoff",
      message:
        input.assistantConfig.fallbackMessage ??
        "I will connect you with our reservation team for further assistance.",
      recommendedAction: "handoff_to_human",
      referencedKnowledgeBase: [],
      confidence: 0.95,
    };
  }

  const checkIn = formatDate(aiResult.entities.checkIn);
  const checkOut = formatDate(aiResult.entities.checkOut);
  const guestCount = aiResult.entities.guestCount;
  const childCount = aiResult.entities.childCount;
  const suggestedRoom = aiResult.availabilityPricing?.suggestedBestFit?.roomType.name ?? "best available room";
  const estimatedTotal = aiResult.availabilityPricing?.estimatedTotalPrice;
  const fallbackRoom = aiResult.availabilityPricing?.fallbackOption?.roomType.name;
  const pricingNote = aiResult.availabilityPricing?.pricingNote;
  const availabilityUpdate = aiResult.availabilityPricing?.reasonIfUnavailable;
  const staySummary = buildStaySummary({
    checkIn,
    checkOut,
    guestCount,
    childCount,
  });
  const familyFriendlyNote =
    typeof childCount === "number" && childCount > 0
      ? " It is one of our most comfortable options for families and gives children more space."
      : "";

  if (language === "tr") {
    return {
      type: "offer",
      message: availabilityUpdate
        ? `Merhaba${guestReference}, talep ettiginiz oda bu tarihlerde cok sinirli gorunuyor. Sizi bekletmemek icin ${fallbackRoom ?? suggestedRoom} secenegimizi onerebilirim.${
            staySummary ? ` ${staySummary} konaklama icin` : ""
          }${estimatedTotal ? ` tahmini toplam tutar ${estimatedTotal} EUR civarindadir.` : "."}${
            pricingNote ? ` ${pricingNote}` : ""
          } Uygunsa bu alternatifi sizin icin ayirmami ister misiniz?`
        : `Harika bir haber${guestReference}! ${suggestedRoom}${
            staySummary ? ` ${staySummary}` : ""
          } icin uygun gorunuyor.${estimatedTotal ? ` Tahmini toplam tutar ${estimatedTotal} EUR civarindadir.` : ""}${
            familyFriendlyNote
          }${pricingNote ? ` ${pricingNote}` : ""} Uygunsa rezervasyonunuzu hazirlamami ister misiniz?`,
      recommendedAction:
        aiResult.qualification === "offer_ready" ? "create_reservation_draft" : "prepare_offer",
      referencedKnowledgeBase: [],
      confidence: availabilityUpdate ? 0.82 : 0.9,
    };
  }

  return {
    type: "offer",
    message: availabilityUpdate
      ? `Thank you${guestReference}. Your preferred room is very limited for these dates, so to keep a good option available I would recommend ${
          fallbackRoom ?? suggestedRoom
        } instead.${staySummary ? ` It works well ${staySummary}.` : ""}${
          estimatedTotal ? ` The estimated total is ${estimatedTotal} EUR.` : ""
        }${pricingNote ? ` ${pricingNote}` : ""} If you would like, I can hold this option and prepare the reservation for you now.`
      : `Great news${guestReference}! ${suggestedRoom} is available${
          staySummary ? ` ${staySummary}` : ""
        }.${estimatedTotal ? ` The estimated total is ${estimatedTotal} EUR.` : ""}${
          familyFriendlyNote
        }${pricingNote ? ` ${pricingNote}` : ""} Would you like me to prepare this option for you?`,
    recommendedAction:
      aiResult.qualification === "offer_ready" ? "create_reservation_draft" : "prepare_offer",
    referencedKnowledgeBase: [],
    confidence: availabilityUpdate ? 0.82 : 0.9,
  };
}
