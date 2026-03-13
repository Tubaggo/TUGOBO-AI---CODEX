import type { ConversationThread } from "../../lib/domain";
import { ChannelBadge } from "./channel-badge";

type ChatThreadProps = {
  thread: ConversationThread;
};

const senderStyles = {
  guest: "bg-slate-100 text-slate-900",
  assistant: "bg-blue-600 text-white",
  human: "bg-emerald-600 text-white",
  system: "bg-slate-800 text-white",
} as const;

export function ChatThread({ thread }: ChatThreadProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {thread.conversation.guestName ?? "Conversation"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {thread.conversation.guestEmail ?? thread.conversation.guestPhone ?? "No contact captured"}
            </p>
          </div>
          <ChannelBadge channel={thread.conversation.source} />
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {thread.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderType === "guest" ? "justify-start" : "justify-end"
            }`}
          >
            <div className="max-w-[85%]">
              <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                {message.senderType}
              </p>
              <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${senderStyles[message.senderType]}`}>
                {message.content}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {new Date(message.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 px-5 py-4">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Reply composer and internal note actions will be wired next.
        </div>
      </div>
    </div>
  );
}
