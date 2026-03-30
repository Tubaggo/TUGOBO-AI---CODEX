"use client";

import { useEffect, useMemo, useState } from "react";
import type { AssistantConfig, ConversationThread } from "../../lib/domain/types";
import type { AiReservationProcessingResult } from "../../lib/ai/types/ai-reservation.types";
import { generateReservationReply } from "../../lib/ai/reply/generate-reservation-reply";

type ConversationThreadProps = {
  thread: ConversationThread;
  aiResult: AiReservationProcessingResult;
  assistantConfig: AssistantConfig;
};

const channelThemes = {
  whatsapp: {
    label: "WhatsApp",
    shell:
      "border-emerald-200 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_38%),linear-gradient(180deg,#f8fffb_0%,#eefbf4_100%)]",
    accent: "bg-emerald-600 text-white shadow-emerald-600/20",
    pill: "bg-emerald-100 text-emerald-700",
    typingDot: "bg-emerald-500",
  },
  instagram: {
    label: "Instagram",
    shell:
      "border-rose-200 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.16),_transparent_38%),linear-gradient(180deg,#fff8fc_0%,#fff2f7_100%)]",
    accent: "bg-gradient-to-r from-rose-500 via-fuchsia-500 to-amber-400 text-white shadow-rose-500/20",
    pill: "bg-rose-100 text-rose-700",
    typingDot: "bg-rose-500",
  },
  webchat: {
    label: "Web Chat",
    shell:
      "border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.14),_transparent_38%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]",
    accent: "bg-slate-900 text-white shadow-slate-900/20",
    pill: "bg-slate-100 text-slate-700",
    typingDot: "bg-slate-500",
  },
} as const;

const senderStyles = {
  guest: "border border-slate-200 bg-white text-slate-900",
  assistant: "bg-slate-900 text-white",
  human: "bg-emerald-600 text-white",
  system: "bg-slate-800 text-white",
} as const;

export function ConversationThreadView({
  thread,
  aiResult,
  assistantConfig,
}: ConversationThreadProps) {
  const safeConversation = thread.conversation;
  const safeMessages = Array.isArray(thread.messages) ? thread.messages : [];
  const [generatedReply, setGeneratedReply] = useState("");
  const [replyMeta, setReplyMeta] = useState<{ type: string; confidence: number } | null>(null);
  const [activeChannel, setActiveChannel] = useState(safeConversation?.source ?? "webchat");
  const [visibleCount, setVisibleCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);

  const nextHiddenMessage = safeMessages[visibleCount];
  const theme = channelThemes[activeChannel];
  const visibleMessages = useMemo(() => safeMessages.slice(0, visibleCount), [safeMessages, visibleCount]);

  useEffect(() => {
    setActiveChannel(safeConversation?.source ?? "webchat");
    setVisibleCount(1);
    setIsTyping(false);
    setGeneratedReply("");
    setReplyMeta(null);
  }, [safeConversation?.id, safeConversation?.source]);

  useEffect(() => {
    if (visibleCount >= safeMessages.length) {
      setIsTyping(false);
      return;
    }

    const upcomingMessage = safeMessages[visibleCount];
    const showTyping = upcomingMessage.senderType === "assistant" || upcomingMessage.senderType === "human";
    const delay = showTyping ? 1400 : 320;

    setIsTyping(showTyping);
    const timer = window.setTimeout(() => {
      setVisibleCount((current) => Math.min(current + 1, safeMessages.length));
      setIsTyping(false);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [safeMessages, visibleCount]);

  function handleGenerateReply() {
    try {
      const nextReply = generateReservationReply({
        thread,
        aiResult,
        assistantConfig,
      });

      setGeneratedReply(nextReply.message);
      setReplyMeta({
        type: nextReply.type,
        confidence: nextReply.confidence,
      });
    } catch {
      setGeneratedReply("AI reply suggestions are temporarily unavailable for this conversation.");
      setReplyMeta({
        type: "follow_up",
        confidence: 0,
      });
    }
  }

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-[30px] border shadow-[0_32px_90px_-48px_rgba(15,23,42,0.4)] ${theme.shell}`}
    >
      <div className="border-b border-black/5 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-slate-900">
                {safeConversation?.guestName ?? "Conversation"}
              </h2>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${theme.pill}`}>
                {theme.label} demo
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {safeConversation?.guestEmail ?? safeConversation?.guestPhone ?? "No contact captured"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Guest messages come in, AI responds instantly, and the booking path stays visible.
            </p>
          </div>
          <div className="flex rounded-2xl border border-slate-200 bg-white/90 p-1 shadow-sm">
            {(["whatsapp", "instagram", "webchat"] as const).map((channel) => {
              const isActive = channel === activeChannel;
              const optionTheme = channelThemes[channel];

              return (
                <button
                  key={channel}
                  type="button"
                  onClick={() => setActiveChannel(channel)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive ? optionTheme.accent : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {optionTheme.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {visibleMessages.length > 0 ? (
          visibleMessages.map((message) => (
          <div
            key={message.id}
            className={`message-enter flex ${message.senderType === "guest" ? "justify-start" : "justify-end"}`}
          >
            <div className="max-w-[85%]">
              <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                {message.senderType === "assistant" ? "AI assistant" : message.senderType}
              </p>
              <div
                className={`rounded-[24px] px-4 py-3 text-sm shadow-[0_14px_30px_-22px_rgba(15,23,42,0.6)] ${senderStyles[message.senderType]}`}
              >
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
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-sm text-slate-500">
            No messages available for this conversation yet.
          </div>
        )}
        {isTyping && nextHiddenMessage ? (
          <div
            className={`message-enter flex ${nextHiddenMessage.senderType === "guest" ? "justify-start" : "justify-end"}`}
          >
            <div className="max-w-[85%]">
              <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                {nextHiddenMessage.senderType === "assistant" ? "AI assistant" : nextHiddenMessage.senderType}
              </p>
              <div className="inline-flex items-center gap-2 rounded-[24px] bg-white px-4 py-3 shadow-[0_14px_30px_-22px_rgba(15,23,42,0.6)]">
                <span className={`h-2.5 w-2.5 animate-bounce rounded-full ${theme.typingDot}`} />
                <span
                  className={`h-2.5 w-2.5 animate-bounce rounded-full ${theme.typingDot} [animation-delay:120ms]`}
                />
                <span
                  className={`h-2.5 w-2.5 animate-bounce rounded-full ${theme.typingDot} [animation-delay:240ms]`}
                />
                <span className="ml-1 text-sm text-slate-500">typing...</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="border-t border-black/5 bg-white/75 px-5 py-4 backdrop-blur">
        <div className="space-y-3 rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">AI Suggested Reply</p>
              <p className="mt-1 text-xs text-slate-500">
                Generate a professional reservation response and edit it before sending.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateReply}
              className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white"
            >
              Generate AI Reply
            </button>
          </div>

          <textarea
            value={generatedReply}
            onChange={(event) => setGeneratedReply(event.target.value)}
            placeholder="Generated assistant reply will appear here."
            className="min-h-28 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none ring-0"
          />
          {replyMeta ? (
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-slate-400">
              <span>{replyMeta.type.replace("_", " ")}</span>
              <span>{Math.round(replyMeta.confidence * 100)}% confidence</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
