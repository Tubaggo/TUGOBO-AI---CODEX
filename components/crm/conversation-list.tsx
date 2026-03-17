import Link from "next/link";
import type { ConversationListItem } from "../../lib/domain";
import { ChannelBadge } from "./channel-badge";
import { StatusBadge } from "./status-badge";

type ConversationListProps = {
  items: ConversationListItem[];
  selectedConversationId: string;
  demoScenarios?: Array<{
    label: string;
    conversationId: string;
  }>;
};

export function ConversationList({
  items,
  selectedConversationId,
  demoScenarios = [],
}: ConversationListProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Inbox</h2>
        <p className="mt-1 text-xs text-slate-500">Unified guest conversations across channels.</p>
        {demoScenarios.length > 0 ? (
          <div className="mt-4 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Demo Scenarios</p>
            <div className="space-y-2">
              {demoScenarios.map((scenario) => {
                const selected = scenario.conversationId === selectedConversationId;

                return (
                  <Link
                    key={scenario.conversationId}
                    href={`/conversations?conversation=${scenario.conversationId}`}
                    className={`block rounded-xl border px-3 py-2 text-sm transition ${
                      selected
                        ? "border-slate-900 bg-slate-950 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {scenario.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => {
          const selected = item.conversation.id === selectedConversationId;

          return (
            <Link
              key={item.conversation.id}
              href={`/conversations?conversation=${item.conversation.id}`}
              className={`block border-b border-slate-100 px-4 py-4 transition hover:bg-slate-50 ${
                selected ? "bg-slate-50" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.conversation.guestName ?? "Unknown guest"}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">{item.lastMessagePreview}</p>
                </div>
                {item.unreadCount > 0 ? (
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ChannelBadge channel={item.channel.type} />
                <StatusBadge status={item.conversation.status} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Assigned to {item.assignedUser?.fullName ?? "Unassigned"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
