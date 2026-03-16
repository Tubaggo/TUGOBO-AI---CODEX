import { ChatThread } from "../../../components/crm/chat-thread";
import { ConversationList } from "../../../components/crm/conversation-list";
import { LeadInformationPanel } from "../../../components/crm/lead-information-panel";
import { getMockConversationEngine } from "../../../lib/mocks/conversation-engine";
import { assistantConfig, knowledgeBaseEntries } from "../../../lib/mocks/settings-module";

type ConversationsPageProps = {
  searchParams?: Promise<{
    conversation?: string;
  }>;
};

export default async function ConversationsPage({ searchParams }: ConversationsPageProps) {
  const params = searchParams ? await searchParams : {};
  const engine = getMockConversationEngine();
  const context = { tenantId: engine.tenantId, actorUserId: "user_staff" };
  const conversations = await engine.service.list(context);
  const selectedConversationId = params.conversation ?? engine.defaultConversationId;
  const thread = await engine.service.getThread(context, selectedConversationId);
  const aiResult = engine.brain.process({
    thread,
    assistantConfig,
    knowledgeBase: knowledgeBaseEntries,
    currentLead: thread.lead,
    now: new Date("2026-03-16T12:00:00.000Z"),
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">CRM Conversation Engine</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Conversations Inbox</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Unified inbox for reservation inquiries across WhatsApp, Instagram DM, and web chat.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
        <div className="min-h-[720px]">
          <ConversationList items={conversations} selectedConversationId={selectedConversationId} />
        </div>
        <div className="min-h-[720px]">
          <ChatThread thread={thread} aiResult={aiResult} assistantConfig={assistantConfig} />
        </div>
        <div className="min-h-[720px]">
          <LeadInformationPanel thread={thread} aiResult={aiResult} />
        </div>
      </div>
    </div>
  );
}
