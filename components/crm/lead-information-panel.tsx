"use client";

import { useEffect, useState } from "react";
import { getCrmI18n, type DemoScenarioId } from "../../lib/crm-translations";
import type { ConversationThread } from "../../lib/domain/types";
import type { AiReservationProcessingResult } from "../../lib/ai/types/ai-reservation.types";
import type { ReservationRecord } from "../../lib/mocks/reservations-module";
import {
  getDemoStageIndex,
  type ConversationDemoScenario,
  type DemoTimelineState,
} from "../../lib/conversation-demo";
import { CreateReservationAction } from "./create-reservation-action";

type LeadInformationPanelProps = {
  thread: ConversationThread;
  aiResult: AiReservationProcessingResult;
  tenantId: string;
  actorUserId: string;
  existingReservation: ReservationRecord | null;
  scenarioLabel?: DemoScenarioId | null;
  analysisPulseKey?: number;
  demoScenario?: ConversationDemoScenario | null;
  timeline?: DemoTimelineState;
};

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  const { copy } = getCrmI18n();

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value ?? copy.common.notCaptured}</p>
    </div>
  );
}

export function LeadInformationPanel({
  thread,
  aiResult,
  tenantId,
  actorUserId,
  existingReservation,
  scenarioLabel,
  analysisPulseKey = 0,
  demoScenario,
  timeline,
}: LeadInformationPanelProps) {
  const {
    copy,
    formatAction,
    formatIntent,
    formatMissingDetails,
    formatMissingField,
    formatQualification,
    formatReadiness,
    formatDate,
  } = getCrmI18n();
  const safeConversation = thread.conversation;
  const lead = thread.lead;
  const [activeHighlight, setActiveHighlight] = useState<"readiness" | "room" | "total" | null>(null);
  const recommendedRoom =
    aiResult.availabilityPricing?.suggestedBestFit?.roomType.name ??
    aiResult.reservationDraftSuggestion?.candidateRoomType ??
    lead?.roomTypePreference;
  const estimatedTotal =
    aiResult.availabilityPricing?.estimatedTotalPrice ??
    aiResult.reservationDraftSuggestion?.estimatedPrice ??
    lead?.estimatedValue;
  const currency =
    aiResult.availabilityPricing?.suggestedBestFit?.roomType.currency ??
    aiResult.reservationDraftSuggestion?.currency ??
    lead?.currency ??
    "EUR";
  const readinessTone =
    aiResult.leadScore.readiness === "high"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : aiResult.leadScore.readiness === "medium"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-slate-100 text-slate-700 ring-slate-200";
  const scenarioMessage = scenarioLabel
    ? copy.ai.scenarioMessages[scenarioLabel]
    : copy.ai.scenarioMessages.standard_booking;
  const stageIndex = getDemoStageIndex(demoScenario ?? null, timeline?.visibleCount ?? 0);
  const activeStage = demoScenario?.stages[stageIndex] ?? null;
  const demoProgress = timeline?.totalCount ? Math.min(100, Math.round(((timeline.visibleCount ?? 0) / timeline.totalCount) * 100)) : 0;
  const persuasiveSignals = demoScenario?.spotlightSignals ?? [];
  const readinessScore = Math.min(
    100,
    Math.max(aiResult.leadScore.score, activeStage ? 58 + stageIndex * 12 : aiResult.leadScore.score),
  );

  useEffect(() => {
    if (analysisPulseKey === 0) {
      return;
    }

    const highlightOrder: Array<"readiness" | "room" | "total"> = ["readiness", "room", "total"];
    const timers = highlightOrder.map((item, index) =>
      window.setTimeout(() => {
        setActiveHighlight(item);
      }, index * 260),
    );
    const clearTimer = window.setTimeout(() => {
      setActiveHighlight(null);
    }, highlightOrder.length * 260 + 1100);

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
      window.clearTimeout(clearTimer);
    };
  }, [analysisPulseKey]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.4)]">
      <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_40%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">{copy.ai.insightsTitle}</h2>
        <p className="mt-1 text-xs text-slate-500">{copy.ai.insightsDescription}</p>
        <p className="mt-3 rounded-2xl border border-sky-100 bg-sky-50/80 px-3 py-2 text-xs text-sky-700">
          {scenarioMessage}
        </p>
        {demoScenario ? (
          <div className="mt-3 grid gap-3">
            <div className="rounded-[22px] border border-slate-200 bg-white/85 px-3 py-3 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                {persuasiveSignals.map((signal) => (
                  <span
                    key={signal.label}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      signal.tone === "emerald"
                        ? "bg-emerald-50 text-emerald-700"
                        : signal.tone === "sky"
                          ? "bg-sky-50 text-sky-700"
                          : signal.tone === "amber"
                            ? "bg-amber-50 text-amber-700"
                            : signal.tone === "rose"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {signal.label}
                  </span>
                ))}
              </div>
              {activeStage ? (
                <>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{activeStage.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{activeStage.detail}</p>
                </>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-rose-100 bg-rose-50 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-rose-500">Kaçan gelir riski</p>
                <p className="mt-2 text-sm font-semibold text-rose-700">{demoScenario.riskNote}</p>
              </div>
              <div className="rounded-[22px] border border-emerald-100 bg-emerald-50 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-500">Demo ilerlemesi</p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">%{demoProgress} satış akışı görünür</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-5 overflow-y-auto px-5 py-5">
        {demoScenario ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Tespit edilen niyet</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{demoScenario.intentLabel ?? formatIntent(aiResult.intent)}</p>
              <p className="mt-1 text-xs text-slate-500">Misafir mesajı rezervasyon veya teklif talebine net şekilde dönüyor.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Sonraki en iyi adım</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{activeStage?.actionLabel ?? demoScenario.nextActionLabel}</p>
              <p className="mt-1 text-xs text-slate-500">{demoScenario.handoffLabel}</p>
            </div>
          </div>
        ) : null}

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.ai.guestSummary}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label={copy.ai.dates}
              value={
                lead?.checkIn && lead?.checkOut
                  ? `${formatDate(lead.checkIn)} ${copy.common.to} ${formatDate(lead.checkOut)}`
                  : null
              }
            />
            <Field
              label={copy.ai.guests}
              value={
                typeof lead?.guestCount === "number"
                  ? `${lead.guestCount} ${copy.common.guests.toLocaleLowerCase("tr-TR")}${
                      lead.childCount ? `, ${lead.childCount} ${copy.leads.children.toLocaleLowerCase("tr-TR")}` : ""
                    }`
                  : null
              }
            />
            <Field
              label={copy.ai.budget}
              value={
                lead?.budget
                  ? `${lead.budget} ${lead.currency}`
                  : aiResult.entities.budget
                    ? `${aiResult.entities.budget} EUR`
                    : null
              }
            />
            <Field label={copy.ai.guest} value={lead?.fullName ?? safeConversation?.guestName} />
          </div>
        </div>

        <div
          className={`rounded-[24px] border border-slate-200 bg-white p-4 transition ${activeHighlight === "readiness" ? "insight-react" : ""}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.ai.bookingReadiness}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{readinessScore}/100</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${readinessTone}`}>
              {activeStage?.readinessLabel ?? formatReadiness(aiResult.leadScore.readiness)}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {aiResult.missingInfo.missingFields.length > 0
              ? formatMissingDetails(aiResult.missingInfo.missingFields.length)
              : copy.ai.enoughInfo}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label={copy.ai.leadStage} value={formatQualification(aiResult.qualification)} />
            <Field label={copy.ai.nextStep} value={formatAction(aiResult.nextAction)} />
          </div>
          {aiResult.missingInfo.missingFields.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {aiResult.missingInfo.missingFields.map((field) => (
                <span key={field} className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
                  {formatMissingField(field)}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-4 text-white">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.ai.reservationRecommendation}</p>
          <div className="mt-4 space-y-4">
            <div className={`rounded-2xl px-3 py-2 transition ${activeHighlight === "room" ? "insight-react-dark" : ""}`}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{copy.ai.recommendedRoom}</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {demoScenario?.offerLabel ?? recommendedRoom ?? copy.ai.reviewRequired}
              </p>
            </div>
            <div className={`rounded-2xl px-3 py-2 transition ${activeHighlight === "total" ? "insight-react-dark" : ""}`}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{copy.ai.estimatedTotalPrice}</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {typeof estimatedTotal === "number" ? `${estimatedTotal} ${currency}` : copy.ai.pending}
              </p>
            </div>
            {aiResult.availabilityPricing?.pricingNote ? (
              <p className="text-sm text-slate-300">{aiResult.availabilityPricing.pricingNote}</p>
            ) : null}
            {demoScenario ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Önerilen teklif</p>
                <p className="mt-2 text-sm text-slate-200">{demoScenario.offerSummary}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.conversations.aiSuggestedReply}</p>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
              {Math.round(aiResult.replySuggestion.confidence * 100)}% {copy.common.confidence}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">{aiResult.replySuggestion.message}</p>
        </div>

        {aiResult.reservationDraftSuggestion ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.ai.createReservation}</p>
            <p className="mt-2 text-sm text-slate-600">{aiResult.reservationDraftSuggestion.notes}</p>
            <div className="mt-4">
              <CreateReservationAction
                tenantId={tenantId}
                actorUserId={actorUserId}
                conversationId={safeConversation?.id ?? ""}
                leadId={aiResult.reservationDraftSuggestion.linkedLeadId}
                adultCount={aiResult.entities.guestCount ?? aiResult.reservationDraftSuggestion.guestCount}
                childCount={aiResult.entities.childCount ?? lead?.childCount ?? 0}
                draft={aiResult.reservationDraftSuggestion}
                existingReservation={existingReservation}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
