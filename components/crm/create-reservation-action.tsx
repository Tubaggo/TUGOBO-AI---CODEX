"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCrmI18n } from "../../lib/crm-translations";
import type { ReservationRecord } from "../../lib/mocks/reservations-module";
import type { ReservationDraftSuggestion } from "../../lib/ai/types/ai-reservation.types";
import { createReservationFromConversationDraftAction } from "../../lib/actions/conversation-reservation-actions";
import { initialCreateReservationActionState } from "../../lib/actions/conversation-reservation-action-state";

type CreateReservationActionProps = {
  tenantId: string;
  actorUserId: string;
  conversationId: string;
  leadId: string | null;
  adultCount: number | null;
  childCount: number | null;
  draft: ReservationDraftSuggestion;
  existingReservation: ReservationRecord | null;
};

export function CreateReservationAction({
  tenantId,
  actorUserId,
  conversationId,
  leadId,
  adultCount,
  childCount,
  draft,
  existingReservation,
}: CreateReservationActionProps) {
  const { copy, formatDate, formatStatus } = getCrmI18n();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createReservationFromConversationDraftAction,
    initialCreateReservationActionState,
  );

  const isCreated = Boolean(existingReservation) || state.status === "success";
  const canCreate =
    Boolean(leadId) &&
    Boolean(draft.suggestedStayDates.checkIn) &&
    Boolean(draft.suggestedStayDates.checkOut) &&
    typeof adultCount === "number" &&
    typeof childCount === "number" &&
    typeof draft.estimatedPrice === "number" &&
    !isCreated;

  useEffect(() => {
    if (state.status === "success") {
      console.log("Created reservation", {
        reservationId: state.reservationId,
        conversationId,
        leadId,
        summary: state.summary,
      });
      router.refresh();
    }
  }, [conversationId, leadId, router, state.reservationId, state.status, state.summary]);

  const summary = state.summary
    ? state.summary
    : existingReservation
      ? {
          reservationId: existingReservation.reservation.id,
          guestName: existingReservation.reservation.guestName,
          room: draft.candidateRoomType,
          checkIn: existingReservation.reservation.checkIn,
          checkOut: existingReservation.reservation.checkOut,
          estimatedPrice: existingReservation.reservation.totalPrice,
          currency: existingReservation.reservation.currency,
          status: existingReservation.reservation.status,
        }
      : null;

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="actorUserId" value={actorUserId} />
      <input type="hidden" name="conversationId" value={conversationId} />
      <input type="hidden" name="leadId" value={leadId ?? ""} />
      <input type="hidden" name="candidateRoomType" value={draft.candidateRoomType ?? ""} />
      <input type="hidden" name="checkIn" value={draft.suggestedStayDates.checkIn ?? ""} />
      <input type="hidden" name="checkOut" value={draft.suggestedStayDates.checkOut ?? ""} />
      <input type="hidden" name="adultCount" value={String(adultCount ?? "")} />
      <input type="hidden" name="childCount" value={String(childCount ?? 0)} />
      <input type="hidden" name="estimatedTotalPrice" value={String(draft.estimatedPrice ?? "")} />
      <input type="hidden" name="currency" value={draft.currency} />
      <input type="hidden" name="notes" value={draft.notes} />

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={!canCreate || isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              {copy.reservations.createReservation.creating}
            </>
          ) : existingReservation ? (
            copy.reservations.createReservation.created
          ) : (
            copy.reservations.createReservation.button
          )}
        </button>
        {existingReservation ? (
          <span className="text-[11px] uppercase tracking-[0.16em] text-emerald-700">
            {existingReservation.reservation.reservationCode}
          </span>
        ) : null}
      </div>

      {state.message ? (
        <p className={`text-xs ${state.status === "error" ? "text-rose-600" : "text-emerald-700"}`}>
          {state.message}
        </p>
      ) : !leadId ? (
        <p className="text-xs text-slate-500">{copy.reservations.createReservation.createFirstLead}</p>
      ) : !canCreate ? (
        <p className="text-xs text-slate-500">{copy.reservations.createReservation.completeDraft}</p>
      ) : null}

      {summary ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-slate-700 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">{copy.reservations.createReservation.createdTitle}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{copy.reservations.createReservation.reservationId}</p>
              <p className="mt-1">{summary.reservationId}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{copy.reservations.createReservation.status}</p>
              <p className="mt-1">{formatStatus(summary.status)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{copy.reservations.createReservation.guest}</p>
              <p className="mt-1">{summary.guestName}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{copy.reservations.createReservation.room}</p>
              <p className="mt-1">{summary.room ?? copy.reservations.createReservation.roomUnassigned}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{copy.reservations.createReservation.checkIn}</p>
              <p className="mt-1">{formatDate(summary.checkIn, { day: "2-digit", month: "short" })}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{copy.reservations.createReservation.checkOut}</p>
              <p className="mt-1">{formatDate(summary.checkOut, { day: "2-digit", month: "short" })}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{copy.reservations.createReservation.estimatedPrice}</p>
              <p className="mt-1">{`${summary.estimatedPrice} ${summary.currency}`}</p>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
