"use client";

import { useState } from "react";
import type { AssistantConfig, ConversationThread } from "../../lib/domain";
import type { AiReservationProcessingResult } from "../../lib/ai";
import { generateReservationReply } from "../../lib/ai/reply/generate-reservation-reply";
import { ChannelBadge } from "./channel-badge";

type ConversationThreadProps = {
  thread: ConversationThread;
  aiResult: AiReservationProcessingResult;
  assistantConfig: AssistantConfig;
};

const senderStyles = {
  guest: "bg-slate-100 text-slate-900",
  assistant: "bg-blue-600 text-white",
  human: "bg-emerald-600 text-white",
  system: "bg-slate-800 text-white",
} as const;

export function ConversationThreadView({
  thread,
  aiResult,
  assistantConfig,
}: ConversationThreadProps) {
  const [generatedReply, setGeneratedReply] = useState("");
  const [replyMeta, setReplyMeta] = useState<{ type: string; confidence: number } | null>(null);

  function handleGenerateReply() {
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
  }

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
            className={`flex ${message.senderType === "guest" ? "justify-start" : "justify-end"}`}
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
        <div className="space-y-3 rounded-2xl bg-slate-50 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Assistant Reply Draft</p>
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
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none ring-0"
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
