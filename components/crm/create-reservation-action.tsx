"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReservationRecord } from "../../lib/mocks/reservations-module";
import type { ReservationDraftSuggestion } from "../../lib/ai/types/ai-reservation.types";
import {
  createReservationFromConversationDraftAction,
  initialCreateReservationActionState,
} from "../../lib/actions/conversation-reservation-actions";

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
      router.refresh();
    }
  }, [router, state.status]);

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
          className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {existingReservation ? "Reservation Created" : isPending ? "Creating..." : "Create Reservation"}
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
        <p className="text-xs text-slate-500">Create or qualify the lead first to create a reservation.</p>
      ) : !canCreate ? (
        <p className="text-xs text-slate-500">Complete the stay dates, guest counts, and price to create the reservation.</p>
      ) : null}
    </form>
  );
}
