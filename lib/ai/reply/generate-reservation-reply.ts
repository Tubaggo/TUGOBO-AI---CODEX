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
  const staySummary = [
    checkIn && checkOut ? `from ${checkIn} to ${checkOut}` : null,
    guestCount ? `for ${guestCount} guest${guestCount > 1 ? "s" : ""}` : null,
    typeof childCount === "number" && childCount > 0
      ? `including ${childCount} child${childCount > 1 ? "ren" : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  if (language === "tr") {
    return {
      type: "offer",
      message: `Harika bir haber${guestReference}! ${staySummary ? `${staySummary} ` : ""}${suggestedRoom} secenegimiz uygun gorunuyor.${
        estimatedTotal ? ` Tahmini toplam tutar ${estimatedTotal} EUR civarindadir.` : ""
      }${fallbackRoom ? ` Dilerseniz ${fallbackRoom} alternatifini de sunabiliriz.` : ""}${
        pricingNote ? ` ${pricingNote}` : ""
      } Rezervasyonunuzu hazirlamami ister misiniz?`,
      recommendedAction:
        aiResult.qualification === "offer_ready" ? "create_reservation_draft" : "prepare_offer",
      referencedKnowledgeBase: [],
      confidence: 0.9,
    };
  }

  return {
    type: "offer",
    message: `Great news${guestReference}! We have ${suggestedRoom} available${
      staySummary ? ` ${staySummary}` : ""
    }.${estimatedTotal ? ` The estimated total is ${estimatedTotal} EUR.` : ""}${
      fallbackRoom ? ` If you prefer, we can also offer ${fallbackRoom} as an alternative.` : ""
    }${pricingNote ? ` ${pricingNote}` : ""} Would you like me to prepare this reservation for you?`,
    recommendedAction:
      aiResult.qualification === "offer_ready" ? "create_reservation_draft" : "prepare_offer",
    referencedKnowledgeBase: [],
    confidence: 0.9,
  };
}
