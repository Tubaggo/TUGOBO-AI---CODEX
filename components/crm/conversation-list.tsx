import Link from "next/link";
import type { ConversationListItem } from "../../lib/domain/types";

type ConversationListProps = {
  items: ConversationListItem[];
  selectedConversationId: string;
  demoScenarios?: ReadonlyArray<{
    label: string;
    conversationId: string;
  }>;
};

const channelMeta = {
  whatsapp: {
    icon: "WA",
    dot: "bg-emerald-500",
    iconClass: "bg-emerald-100 text-emerald-700",
  },
  instagram: {
    icon: "IG",
    dot: "bg-rose-500",
    iconClass: "bg-rose-100 text-rose-700",
  },
  webchat: {
    icon: "WEB",
    dot: "bg-slate-400",
    iconClass: "bg-slate-200 text-slate-700",
  },
} as const;

function getInboxStatus(item: ConversationListItem) {
  if (item.unreadCount > 0) {
    return {
      label: "New message",
      className: "bg-blue-100 text-blue-700",
    };
  }

  if (item.conversation.status === "waiting") {
    return {
      label: "Waiting",
      className: "bg-amber-100 text-amber-700",
    };
  }

  return {
    label: "AI replied",
    className: "bg-emerald-100 text-emerald-700",
  };
}

export function ConversationList({
  items,
  selectedConversationId,
  demoScenarios = [],
}: ConversationListProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.4)]">
      <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_45%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Inbox</h2>
            <p className="mt-1 text-xs text-slate-500">Incoming guest chats that AI is actively handling.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            {items.length} active
          </div>
        </div>
        {demoScenarios.length > 0 ? (
          <div className="mt-4 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Demo Scenarios</p>
            <div className="grid gap-2">
              {demoScenarios.map((scenario) => {
                const selected = scenario.conversationId === selectedConversationId;

                return (
                  <Link
                    key={scenario.conversationId}
                    href={`/conversations?conversation=${scenario.conversationId}`}
                    className={`block rounded-2xl border px-3 py-2 text-sm transition ${
                      selected
                        ? "border-slate-900 bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
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
      <div className="flex-1 overflow-y-auto bg-slate-50/60">
        {items.length > 0 ? items.map((item) => {
          const selected = item.conversation.id === selectedConversationId;
          const status = getInboxStatus(item);
          const meta = channelMeta[item.channel.type];

          return (
            <Link
              key={item.conversation.id}
              href={`/conversations?conversation=${item.conversation.id}`}
              className={`block border-b border-slate-200/80 px-4 py-4 transition ${
                selected ? "bg-white" : "hover:bg-white/80"
              }`}
            >
              <div
                className={`rounded-[22px] border px-3 py-3 transition ${
                  selected
                    ? "border-slate-900 bg-slate-950 text-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.85)]"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[11px] font-semibold tracking-[0.18em] ${
                        selected ? "bg-white/12 text-white" : meta.iconClass
                      }`}
                    >
                      {meta.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                          {item.conversation.guestName ?? "Unknown guest"}
                        </p>
                        <span className={`h-2 w-2 rounded-full ${selected ? "bg-white/60" : meta.dot}`} />
                      </div>
                      <p className={`mt-1 truncate text-xs ${selected ? "text-slate-300" : "text-slate-500"}`}>
                        {item.lastMessagePreview}
                      </p>
                    </div>
                  </div>
                  {item.unreadCount > 0 ? (
                    <span
                      className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${selected ? "bg-sky-300" : "bg-blue-500"}`}
                    />
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      selected ? "bg-white/12 text-white" : status.className
                    }`}
                  >
                    {status.label}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                      selected ? "bg-white/12 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.channel.type === "webchat" ? "Web Chat" : item.channel.type}
                  </span>
                </div>
                <p className={`mt-3 text-xs ${selected ? "text-slate-300" : "text-slate-500"}`}>
                  {item.assignedUser?.fullName ?? "Unassigned"} |{" "}
                  {item.conversation.status === "human_handling"
                    ? "Human takeover"
                    : item.conversation.status.replace("_", " ")}
                </p>
              </div>
            </Link>
          );
        }) : (
          <div className="px-4 py-6 text-sm text-slate-500">No conversations available.</div>
        )}
      </div>
    </div>
  );
}
