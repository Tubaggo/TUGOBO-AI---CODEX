import type { AssistantConfig, ConversationThread } from "../../domain/types";
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
  language: string | null;
}): string {
  const parts =
    input.language === "tr"
      ? [
          input.checkIn && input.checkOut ? `${input.checkIn} - ${input.checkOut} tarihleri arasında` : null,
          input.guestCount ? `${input.guestCount} misafir için` : null,
          typeof input.childCount === "number" && input.childCount > 0
            ? `${input.childCount} çocuk dahil`
            : null,
        ].filter(Boolean)
      : [
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
    guest_name: { en: "guest name", tr: "misafir adı" },
    phone: { en: "phone number", tr: "telefon numarası" },
    email: { en: "email address", tr: "e-posta adresi" },
    language: { en: "preferred language", tr: "tercih ettiğiniz dil" },
    check_in: { en: "check-in date", tr: "giriş tarihi" },
    check_out: { en: "check-out date", tr: "çıkış tarihi" },
    guest_count: { en: "number of guests", tr: "misafir sayısı" },
    child_count: { en: "number of children", tr: "çocuk sayısı" },
    room_type_preference: { en: "preferred room type", tr: "oda tercihiniz" },
    budget: { en: "approximate budget", tr: "yaklaşık bütçeniz" },
    special_requests: { en: "special requests", tr: "özel talepleriniz" },
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
        ? `Merhaba${guestReference}, size en güzel seçeneği hazırlayabilmem için ${fields.join(", ")} bilgisini de paylaşır mısınız?`
        : `Hello${guestReference}, I'd love to help with your stay. Could you share ${joined} so I can suggest the best room for you?`,
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
        "I'm bringing in our reservations team so they can look after this for you.",
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
    language,
  });
  const familyFriendlyNote =
    typeof childCount === "number" && childCount > 0
      ? language === "tr"
        ? " Aileler için en konforlu seçeneklerimizden biridir ve çocuklara daha fazla alan sunar."
        : " It is one of our most comfortable options for families and gives children more space."
      : "";

  if (language === "tr") {
    return {
      type: "offer",
      message: availabilityUpdate
        ? `Merhaba${guestReference}, bu tarihler çok talep görüyor ve istediğiniz oda hızla doluyor. ${fallbackRoom ?? suggestedRoom} şu an uygun ve rahat bir alternatif olur.${estimatedTotal ? ` Toplam tutar yaklaşık ${estimatedTotal} EUR civarında.` : ""}${pricingNote ? ` ${pricingNote}` : ""} İsterseniz sizin için hemen ayırayım.`
        : `Harika bir seçim${guestReference}, ${suggestedRoom}${staySummary ? ` ${staySummary}` : ""} için çok güzel duruyor.${estimatedTotal ? ` Toplam tutar yaklaşık ${estimatedTotal} EUR civarında.` : ""}${familyFriendlyNote}${pricingNote ? ` ${pricingNote}` : ""} İsterseniz sizin için hazırlayayım.`,
      recommendedAction:
        aiResult.qualification === "offer_ready" ? "create_reservation_draft" : "prepare_offer",
      referencedKnowledgeBase: [],
      confidence: availabilityUpdate ? 0.82 : 0.9,
    };
  }

  return {
    type: "offer",
    message: availabilityUpdate
      ? `Thank you${guestReference}, those dates are in high demand and your preferred room is going quickly. ${fallbackRoom ?? suggestedRoom} is still available and would make for a very comfortable stay.${staySummary ? ` It suits a stay ${staySummary}.` : ""}${estimatedTotal ? ` The total would be around ${estimatedTotal} EUR.` : ""}${pricingNote ? ` ${pricingNote}` : ""} Would you like me to hold it for you?`
      : `Wonderful news${guestReference}, ${suggestedRoom} is available${staySummary ? ` ${staySummary}` : ""}.${estimatedTotal ? ` The total would be around ${estimatedTotal} EUR.` : ""}${familyFriendlyNote}${pricingNote ? ` ${pricingNote}` : ""} Would you like me to prepare it for you now?`,
    recommendedAction:
      aiResult.qualification === "offer_ready" ? "create_reservation_draft" : "prepare_offer",
    referencedKnowledgeBase: [],
    confidence: availabilityUpdate ? 0.82 : 0.9,
  };
}
