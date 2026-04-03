import type { AiReservationProcessingResult } from "./ai/types/ai-reservation.types";
import type { Message, MessageSenderType, ConversationThread } from "./domain/types";
import type { DemoScenarioId } from "./crm-translations";

export type DemoTimelineState = {
  visibleCount: number;
  totalCount: number;
  isTyping: boolean;
  nextMessageSender: MessageSenderType | null;
  latestVisibleMessage: Message | null;
};

export type DemoSignalTone = "emerald" | "sky" | "amber" | "rose" | "slate";

export type DemoSignal = {
  label: string;
  tone: DemoSignalTone;
};

export type DemoStage = {
  title: string;
  detail: string;
  actionLabel: string;
  readinessLabel: string;
  cueLabel: string;
};

export type ConversationDemoScenario = {
  id: DemoScenarioId;
  title: string;
  valueHook: string;
  riskNote: string;
  intentLabel: string;
  offerLabel: string;
  offerSummary: string;
  handoffLabel: string;
  nextActionLabel: string;
  stageThresholds: number[];
  stages: DemoStage[];
  extraMessages: Message[];
  spotlightSignals: DemoSignal[];
};

const scenarioCatalog: Record<DemoScenarioId, Omit<ConversationDemoScenario, "intentLabel" | "offerLabel" | "offerSummary" | "nextActionLabel">> = {
  standard_booking: {
    id: "standard_booking",
    title: "Standart Rezervasyon",
    valueHook: "Hızlı ilk yanıt, sıcak talebi doğrudan rezervasyona taşır.",
    riskNote: "Bu mesaj birkaç dakika cevapsız kalsa misafir OTA veya rakip otele kayabilir.",
    handoffLabel: "Temsilci ödeme adımında devralabilir",
    stageThresholds: [1, 3, 4, 5],
    stages: [
      {
        title: "Talep yakalandı",
        detail: "Misafir tarih ve kişi bilgisini net verdi. Sistem bunu doğrudan rezervasyon fırsatı olarak işaretliyor.",
        actionLabel: "Talebi sıcak fırsat olarak işaretle",
        readinessLabel: "İlgi yüksek",
        cueLabel: "Canlı",
      },
      {
        title: "Niyet anlaşıldı",
        detail: "Yapay zeka tarih, kişi sayısı ve oda beklentisini anlamlandırıp güven veren bir tonla ilerliyor.",
        actionLabel: "Oda tercihini doğrula",
        readinessLabel: "Yapay zeka yanıtladı",
        cueLabel: "Anında yanıt",
      },
      {
        title: "En uygun teklif seçildi",
        detail: "Balkonlu deniz manzaralı oda, bütçe ile eşleştiriliyor ve satın almaya yakın bir teklif oluşuyor.",
        actionLabel: "Teklifi hazırla",
        readinessLabel: "Teklif hazır",
        cueLabel: "En iyi eşleşme",
      },
      {
        title: "Rezervasyona hazır",
        detail: "Misafir toplam fiyat ve ödeme adımı istiyor. Bu noktada görüşme doğrudan satışa dönmeye çok yakın.",
        actionLabel: "Ödeme linkini gönder",
        readinessLabel: "Rezervasyona hazır",
        cueLabel: "Kapanış anı",
      },
    ],
    spotlightSignals: [
      { label: "Canlı", tone: "emerald" },
      { label: "Yapay zeka yanıtladı", tone: "sky" },
      { label: "Rezervasyona hazır", tone: "emerald" },
    ],
    extraMessages: [
      {
        id: "demo_msg_anna_4",
        conversationId: "conv_anna",
        senderType: "assistant",
        senderUserId: null,
        messageType: "text",
        content:
          "Balcony sea view için en uygun seçenek Deluxe Sea View Room görünüyor. Toplam konaklama 690 EUR ve isterseniz oda için kısa süreli tutma başlatabilirim.",
        rawPayload: null,
        createdAt: "2026-03-12T08:11:00.000Z",
      },
      {
        id: "demo_msg_anna_5",
        conversationId: "conv_anna",
        senderType: "guest",
        senderUserId: null,
        messageType: "text",
        content:
          "Perfect, please send the total price and secure payment step. If everything looks good, we can confirm today.",
        rawPayload: null,
        createdAt: "2026-03-12T08:12:00.000Z",
      },
    ],
  },
  family_with_children: {
    id: "family_with_children",
    title: "Çocuklu Aile",
    valueHook: "Aile ihtiyaçlarını anlayan hızlı yanıt, güveni ve kapanış hızını belirgin biçimde artırır.",
    riskNote: "Aileler geç veya eksik yanıtta güven kaybeder; en hızlı alternatif genelde rezervasyonu alır.",
    handoffLabel: "Temsilci aile paketini son kez kontrol edebilir",
    stageThresholds: [1, 2, 3, 4],
    stages: [
      {
        title: "Aile ihtiyacı tespit edildi",
        detail: "Çocuk sayısı ve konaklama tipi net. Yapay zeka bunu aile odaklı satış senaryosu olarak işliyor.",
        actionLabel: "Aile dostu oda öner",
        readinessLabel: "Niyet net",
        cueLabel: "Aile talebi",
      },
      {
        title: "Konfor vurgulandı",
        detail: "Yapay zeka alan, rahatlık ve çocuklarla kolay konaklama temasını öne çıkarıyor.",
        actionLabel: "Aile paketi oluştur",
        readinessLabel: "Yapay zeka yanıtladı",
        cueLabel: "Güven oluşturuldu",
      },
      {
        title: "Ek ihtiyaçlar toplandı",
        detail: "Beşik, transfer ve çocuk dostu detaylar yakalandı. Teklif artık daha satışa yakın ve kişiselleştirilmiş.",
        actionLabel: "Ek hizmetleri pakete ekle",
        readinessLabel: "Teklif güçlendi",
        cueLabel: "Ek hizmet fırsatı",
      },
      {
        title: "Aile paketi hazır",
        detail: "Misafir karar vermek için ihtiyaç duyduğu tüm detayları neredeyse aldı. Ekip burada çok hızlı kapatabilir.",
        actionLabel: "Aile teklifini gönder",
        readinessLabel: "Teklif hazır",
        cueLabel: "Kapanışa yakın",
      },
    ],
    spotlightSignals: [
      { label: "Canlı", tone: "emerald" },
      { label: "Teklif hazır", tone: "amber" },
      { label: "Temsilci devralabilir", tone: "slate" },
    ],
    extraMessages: [
      {
        id: "demo_msg_julia_3",
        conversationId: "conv_julia",
        senderType: "guest",
        senderUserId: null,
        messageType: "text",
        content:
          "Do you also have a baby cot and airport transfer? We want the easiest option for the children.",
        rawPayload: null,
        createdAt: "2026-03-13T09:19:00.000Z",
      },
      {
        id: "demo_msg_julia_4",
        conversationId: "conv_julia",
        senderType: "assistant",
        senderUserId: null,
        messageType: "text",
        content:
          "Yes, I can prepare the Family Villa with baby cot, breakfast, and airport transfer in one family-friendly offer. If you like, I can send the full package now.",
        rawPayload: null,
        createdAt: "2026-03-13T09:20:00.000Z",
      },
    ],
  },
  high_demand_alternative_offer: {
    id: "high_demand_alternative_offer",
    title: "Yoğun Talep / Alternatif Teklif",
    valueHook: "AI, kaçabilecek talebi alternatif odaya yönlendirip geliri korur.",
    riskNote: "Yoğun tarihlerde geç dönüş, misafirin birkaç dakika içinde başka işletmeye gitmesi anlamına gelebilir.",
    handoffLabel: "Temsilci son fiyat onayı için devralabilir",
    stageThresholds: [1, 2, 3, 4],
    stages: [
      {
        title: "Yoğun talep algılandı",
        detail: "Misafir popüler tarihlerde belirli bir oda istiyor. Burada hız doğrudan gelir koruması anlamına geliyor.",
        actionLabel: "Müsaitliği teyit et",
        readinessLabel: "Yüksek talep",
        cueLabel: "Stok baskısı",
      },
      {
        title: "Alternatif teklif sunuldu",
        detail: "Yapay zeka sadece yok demek yerine daha güçlü bir alternatif öneriyor ve satış ihtimalini canlı tutuyor.",
        actionLabel: "Alternatif avantajını anlat",
        readinessLabel: "Yapay zeka yanıtladı",
        cueLabel: "Gelir korunuyor",
      },
      {
        title: "Misafir alternatifle ilgileniyor",
        detail: "Misafir hızlı karar verebileceğini gösterdi. Bu, satış ekibi için yüksek kapanış sinyali.",
        actionLabel: "Kısa süreli tutma öner",
        readinessLabel: "Teklif sıcak",
        cueLabel: "Hızlı kapanış",
      },
      {
        title: "Teklif kapanışa hazır",
        detail: "Kısa süreli hold ve net sonraki adım ile görüşme kaybedilmeden satışa döndürülüyor.",
        actionLabel: "Hold ve ödeme adımını başlat",
        readinessLabel: "Teklif hazır",
        cueLabel: "Rezervasyon korunuyor",
      },
    ],
    spotlightSignals: [
      { label: "Yüksek talep", tone: "rose" },
      { label: "Alternatif teklif", tone: "amber" },
      { label: "Teklif hazır", tone: "emerald" },
    ],
    extraMessages: [
      {
        id: "demo_msg_omar_3",
        conversationId: "conv_omar",
        senderType: "guest",
        senderUserId: null,
        messageType: "text",
        content:
          "If the sea view room is gone, what is the best alternative? We can decide quickly if you can hold something.",
        rawPayload: null,
        createdAt: "2026-03-08T12:26:00.000Z",
      },
      {
        id: "demo_msg_omar_4",
        conversationId: "conv_omar",
        senderType: "assistant",
        senderUserId: null,
        messageType: "text",
        content:
          "The Family Villa is available right now and I can place a courtesy hold for 30 minutes. If you want, I will prepare the offer and payment step immediately.",
        rawPayload: null,
        createdAt: "2026-03-08T12:27:00.000Z",
      },
    ],
  },
};

export function getConversationDemoScenario(
  scenarioId: DemoScenarioId | null | undefined,
  thread: ConversationThread,
  aiResult: AiReservationProcessingResult,
): ConversationDemoScenario | null {
  if (!scenarioId) {
    return null;
  }

  const base = scenarioCatalog[scenarioId];
  const lead = thread.lead;

  return {
    ...base,
    intentLabel:
      aiResult.intent === "reservation_request"
        ? "Rezervasyon talebi"
        : aiResult.intent === "availability_check"
          ? "Müsaitlik ve alternatif oda talebi"
          : aiResult.intent === "price_request"
            ? "Fiyat ve teklif talebi"
            : "Rezervasyon fırsatı",
    offerLabel:
      aiResult.availabilityPricing?.suggestedBestFit?.roomType.name ??
      aiResult.reservationDraftSuggestion?.candidateRoomType ??
      lead?.roomTypePreference ??
      "En uygun teklif hazırlanıyor",
    offerSummary:
      aiResult.availabilityPricing?.pricingNote ??
      aiResult.reservationDraftSuggestion?.notes ??
      base.valueHook,
    nextActionLabel:
      aiResult.replySuggestion.recommendedAction === "create_reservation_draft"
        ? "Taslağı oluştur ve ödeme adımına geç"
        : aiResult.replySuggestion.recommendedAction === "prepare_offer"
          ? "Teklifi gönder ve kısa süreli hold aç"
          : aiResult.replySuggestion.recommendedAction === "handoff_to_human"
            ? "Temsilciye aktar ve kapanışı hızlandır"
            : base.stages[base.stages.length - 1]?.actionLabel ?? "Görüşmeyi satışa taşı",
  };
}

export function createDemoThread(
  thread: ConversationThread,
  scenarioId: DemoScenarioId | null | undefined,
): ConversationThread {
  if (!scenarioId) {
    return thread;
  }

  const scenario = scenarioCatalog[scenarioId];
  const existingIds = new Set(thread.messages.map((message) => message.id));
  const extraMessages = scenario.extraMessages.filter(
    (message) =>
      message.conversationId === thread.conversation.id &&
      !existingIds.has(message.id),
  );

  if (extraMessages.length === 0) {
    return thread;
  }

  return {
    ...thread,
    messages: [...thread.messages, ...extraMessages].sort((left, right) =>
      left.createdAt.localeCompare(right.createdAt),
    ),
  };
}

export function getDemoStageIndex(
  scenario: ConversationDemoScenario | null,
  visibleCount: number,
): number {
  if (!scenario) {
    return 0;
  }

  const thresholds = scenario.stageThresholds;
  const index = thresholds.findIndex((threshold) => visibleCount <= threshold);

  if (index === -1) {
    return Math.max(scenario.stages.length - 1, 0);
  }

  return index;
}
