import { ConversationList } from "../../../components/crm/conversation-list";
import { ConversationsDemoShell } from "../../../components/crm/conversations-demo-shell";
import type { AiReservationProcessingResult } from "../../../lib/ai/types/ai-reservation.types";
import type { ConversationListItem } from "../../../lib/domain/types";
import { getMockConversationEngine } from "../../../lib/mocks/conversation-engine";
import { getReservationByLeadId } from "../../../lib/mocks/reservations-module";
import { assistantConfig, knowledgeBaseEntries } from "../../../lib/mocks/settings-module";

type ConversationsPageProps = {
  searchParams?: Promise<{
    conversation?: string;
  }>;
};

const demoScenarios = [
  { label: "Standard Booking", conversationId: "conv_anna" },
  { label: "Family with Children", conversationId: "conv_julia" },
  { label: "High Demand / Alternative Offer", conversationId: "conv_omar" },
] as const;

function createFallbackAiResult(): AiReservationProcessingResult {
  return {
    normalizedGuestMessage: "",
    intent: "other",
    entities: {
      guestName: null,
      phone: null,
      email: null,
      language: null,
      checkIn: null,
      checkOut: null,
      guestCount: null,
      childCount: null,
      roomTypePreference: null,
      budget: null,
      specialRequests: [],
    },
    missingInfo: {
      requiredFields: [],
      missingFields: [],
      isComplete: false,
      completionRatio: 0,
    },
    leadScore: {
      score: 0,
      readiness: "low",
      factors: [],
    },
    qualification: "new",
    nextAction: "wait_for_guest_reply",
    availabilityPricing: null,
    replySuggestion: {
      type: "follow_up",
      message: "AI insights will appear here when a conversation is available.",
      recommendedAction: "wait_for_guest_reply",
      referencedKnowledgeBase: [],
      confidence: 0,
    },
    leadUpdateSuggestion: {
      createOrUpdate: "create",
      fields: {},
    },
    reservationDraftSuggestion: null,
  };
}

function resolveConversationId(input: {
  requestedConversationId?: string;
  availableConversationIds: string[];
  defaultConversationId: string;
}) {
  if (
    input.requestedConversationId &&
    input.availableConversationIds.includes(input.requestedConversationId)
  ) {
    return input.requestedConversationId;
  }

  if (input.availableConversationIds.includes(input.defaultConversationId)) {
    return input.defaultConversationId;
  }

  return input.availableConversationIds[0] ?? input.defaultConversationId;
}

async function loadSelectedThread(input: {
  engine: ReturnType<typeof getMockConversationEngine>;
  context: { tenantId: string; actorUserId: string };
  selectedConversationId: string;
  availableConversationIds: string[];
}) {
  try {
    return await input.engine.service.getThread(input.context, input.selectedConversationId);
  } catch {
    const fallbackConversationId = input.availableConversationIds[0];

    if (!fallbackConversationId || fallbackConversationId === input.selectedConversationId) {
      return null;
    }

    try {
      return await input.engine.service.getThread(input.context, fallbackConversationId);
    } catch {
      return null;
    }
  }
}

export default async function ConversationsPage({ searchParams }: ConversationsPageProps) {
  const params = searchParams ? await searchParams : {};
  const engine = getMockConversationEngine();
  const context = { tenantId: engine.tenantId, actorUserId: "user_staff" };
  let conversations: ConversationListItem[] = [];

  try {
    conversations = await engine.service.list(context);
  } catch {
    conversations = [];
  }

  const availableConversationIds = conversations.map((item) => item.conversation.id);

  if (availableConversationIds.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">CRM Conversation Engine</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">Conversations Inbox</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Unified inbox for reservation inquiries across WhatsApp, Instagram DM, and web chat.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-sm text-slate-500">
          No conversations are available right now.
        </div>
      </div>
    );
  }

  const selectedConversationId = resolveConversationId({
    requestedConversationId: typeof params.conversation === "string" ? params.conversation : undefined,
    availableConversationIds,
    defaultConversationId: engine.defaultConversationId,
  });
  const thread = await loadSelectedThread({
    engine,
    context,
    selectedConversationId,
    availableConversationIds,
  });

  if (!thread) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">CRM Conversation Engine</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">Conversations Inbox</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Unified inbox for reservation inquiries across WhatsApp, Instagram DM, and web chat.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="min-h-[720px]">
            <ConversationList
              items={conversations}
              selectedConversationId={selectedConversationId}
              demoScenarios={demoScenarios}
            />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-sm text-slate-500">
            The selected conversation could not be loaded.
          </div>
        </div>
      </div>
    );
  }

  let aiResult: AiReservationProcessingResult;

  try {
    aiResult = engine.brain.process({
      thread,
      assistantConfig,
      knowledgeBase: knowledgeBaseEntries,
      currentLead: thread.lead,
      now: new Date("2026-03-16T12:00:00.000Z"),
    });
  } catch {
    aiResult = createFallbackAiResult();
  }

  const existingReservation = thread.lead ? getReservationByLeadId(thread.lead.id) : null;
  const activeScenario =
    demoScenarios.find((scenario) => scenario.conversationId === selectedConversationId)?.label ?? null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-sky-600">Sales Demo Conversation Flow</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-950">
          Never miss a booking again - even at 2 AM
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Show hotel owners how AI replies instantly across WhatsApp, Instagram DM, and website
          chat, then guides each guest toward reservation.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_360px]">
        <div className="min-h-[720px]">
          <ConversationList
            items={conversations}
            selectedConversationId={selectedConversationId}
            demoScenarios={demoScenarios}
          />
        </div>
        <ConversationsDemoShell
          thread={thread}
          aiResult={aiResult}
          assistantConfig={assistantConfig}
          tenantId={engine.tenantId}
          actorUserId={context.actorUserId}
          existingReservation={existingReservation}
          scenarioLabel={activeScenario}
        />
      </div>
    </div>
  );
}
