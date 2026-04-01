"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ConversationStep = {
  id: string;
  type: "guest" | "assistant" | "typing";
  content?: string;
};

const stepDurations = [1000, 900, 1800, 1500, 900, 2200];

type HomeHeroPreviewProps = {
  copy: {
    liveConversationDemo: string;
    guestConversation: string;
    guestName: string;
    guestMeta: string;
    aiReply: string;
    guestIntentDetected: string;
    aiIsReplying: string;
    reservationSummary: string;
    reservationReady: string;
    inProgress: string;
    stay: string;
    stayValue: string;
    suggestedRoom: string;
    suggestedRoomValue: string;
    estimatedValue: string;
    nextAction: string;
    nextActionReady: string;
    nextActionPending: string;
    confirmationStatus: string;
    confirmationReady: string;
    confirmationPending: string;
    openLiveDemo: string;
    footerText: string;
    steps: readonly ConversationStep[];
  };
};

export function HomeHeroPreview({ copy }: HomeHeroPreviewProps) {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = (index: number) => {
      if (cancelled) {
        return;
      }

      setVisibleCount(index + 1);

      timer = setTimeout(() => {
        if (index === copy.steps.length - 1) {
          setVisibleCount(1);
          run(0);
          return;
        }

        run(index + 1);
      }, stepDurations[index]);
    };

    timer = setTimeout(() => run(0), 500);

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [copy.steps.length]);

  const visibleSteps = useMemo(() => copy.steps.slice(0, visibleCount), [copy.steps, visibleCount]);
  const intentDetected = visibleSteps.some((step) => step.id === "guest-2");
  const reservationReady = visibleSteps.some((step) => step.id === "assistant-2");

  return (
    <div className="relative mx-auto w-full max-w-[720px] lg:justify-self-end">
      <div className="demo-glow absolute inset-0 scale-[1.03] rounded-[40px]" />
      <div className="demo-pulse-ring absolute inset-0 rounded-[40px]" />
      <div className="demo-hover relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(15,23,42,0.9))] p-4 shadow-[0_40px_120px_-48px_rgba(14,165,233,0.65)] transition-transform duration-500">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-black/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                {copy.liveConversationDemo}
              </span>
            </div>
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative flex h-[500px] min-h-[500px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.6)]">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {copy.guestConversation}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">{copy.guestName}</h3>
                  <p className="mt-1 text-sm text-slate-500">{copy.guestMeta}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <span className="attention-badge rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                    {copy.aiReply}
                  </span>
                  {intentDetected ? (
                    <span className="attention-badge rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {copy.guestIntentDetected}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 flex-1 overflow-hidden">
                <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1">
                  {visibleSteps.map((step) => {
                    if (step.type === "typing") {
                      return (
                        <div
                          key={step.id}
                        className="typing-dots w-fit rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-base text-slate-500 shadow-sm"
                      >
                        <span className="typing-dot bg-slate-300" />
                        <span className="typing-dot bg-slate-300" />
                        <span className="typing-dot bg-slate-300" />
                        <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {copy.aiIsReplying}
                        </span>
                      </div>
                    );
                  }

                    const bubbleClass =
                      step.type === "assistant"
                        ? "ai-message-bubble ml-auto max-w-[90%] rounded-3xl rounded-br-md px-5 py-4 text-[15px] leading-7 text-white"
                        : "message-enter max-w-[82%] rounded-3xl rounded-bl-md bg-slate-100 px-5 py-4 text-[15px] leading-7 text-slate-700 shadow-sm";

                    const toneClass =
                      step.type === "assistant"
                        ? step.id === "assistant-2"
                          ? "bg-slate-950"
                          : "bg-gradient-to-r from-sky-600 to-cyan-500"
                        : "";

                    return (
                      <div key={step.id} className={`${bubbleClass} ${toneClass}`}>
                        {step.content}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex h-[500px] min-h-[500px] flex-col rounded-[24px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(5,10,25,0.98),rgba(8,20,40,0.95))] p-5 text-slate-100 shadow-[0_24px_60px_-34px_rgba(8,145,178,0.6)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {copy.reservationSummary}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                    reservationReady ? "bg-cyan-400/10 text-cyan-200" : "bg-white/8 text-slate-300"
                  }`}
                >
                  {reservationReady ? copy.reservationReady : copy.inProgress}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">{copy.stay}</p>
                  <p className="mt-2 text-base font-medium text-white">{copy.stayValue}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">{copy.suggestedRoom}</p>
                  <p className="mt-2 text-base font-medium text-white">{copy.suggestedRoomValue}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">{copy.estimatedValue}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">EUR 750</p>
                </div>
              </div>

              <div
                className={`mt-5 rounded-2xl border p-4 transition duration-500 ${
                  reservationReady
                    ? "insight-react-dark border-cyan-300/20 bg-cyan-400/10"
                    : "border-white/8 bg-white/5"
                }`}
              >
                <p className={reservationReady ? "text-cyan-200" : "text-slate-400"}>{copy.nextAction}</p>
                <p className="mt-2 text-sm leading-6 text-white">
                  {reservationReady ? copy.nextActionReady : copy.nextActionPending}
                </p>
              </div>

              <div className="mt-auto rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-200">
                  {copy.confirmationStatus}
                </p>
                <p className="mt-2 text-base font-medium text-white">
                  {reservationReady ? copy.confirmationReady : copy.confirmationPending}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
          <p className="text-sm text-slate-300">{copy.footerText}</p>
          <Link
            href="/conversations"
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            {copy.openLiveDemo}
          </Link>
        </div>
      </div>
    </div>
  );
}
