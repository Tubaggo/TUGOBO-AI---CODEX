import type { ConversationThread } from "../../lib/domain/types";
import type { AiReservationProcessingResult } from "../../lib/ai/types/ai-reservation.types";
import type { ReservationRecord } from "../../lib/mocks/reservations-module";
import { CreateReservationAction } from "./create-reservation-action";

type LeadInformationPanelProps = {
  thread: ConversationThread;
  aiResult: AiReservationProcessingResult;
  tenantId: string;
  actorUserId: string;
  existingReservation: ReservationRecord | null;
};

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value ?? "Not captured"}</p>
    </div>
  );
}

export function LeadInformationPanel({
  thread,
  aiResult,
  tenantId,
  actorUserId,
  existingReservation,
}: LeadInformationPanelProps) {
  const safeConversation = thread.conversation;
  const lead = thread.lead;
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

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.4)]">
      <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_40%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">AI Assistant Insights</h2>
        <p className="mt-1 text-xs text-slate-500">The key booking signals your team needs to convert this chat.</p>
      </div>

      <div className="space-y-5 overflow-y-auto px-5 py-5">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Guest summary</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Dates"
              value={
                lead?.checkIn && lead?.checkOut
                  ? `${new Date(lead.checkIn).toLocaleDateString("en-GB")} - ${new Date(lead.checkOut).toLocaleDateString("en-GB")}`
                  : null
              }
            />
            <Field
              label="Guests"
              value={
                typeof lead?.guestCount === "number"
                  ? `${lead.guestCount} guests${lead.childCount ? `, ${lead.childCount} children` : ""}`
                  : null
              }
            />
            <Field
              label="Budget"
              value={
                lead?.budget
                  ? `${lead.budget} ${lead.currency}`
                  : aiResult.entities.budget
                    ? `${aiResult.entities.budget} EUR`
                    : null
              }
            />
            <Field label="Guest" value={lead?.fullName ?? safeConversation?.guestName} />
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Booking readiness</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{aiResult.leadScore.score}/100</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ${readinessTone}`}>
              {aiResult.leadScore.readiness}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {aiResult.missingInfo.missingFields.length > 0
              ? `AI still needs ${aiResult.missingInfo.missingFields.length} more detail${aiResult.missingInfo.missingFields.length > 1 ? "s" : ""} before the booking is fully locked.`
              : "AI has enough information to guide this conversation toward a reservation."}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Lead stage" value={aiResult.qualification.replace("_", " ")} />
            <Field label="Next step" value={aiResult.nextAction.replace("_", " ")} />
          </div>
          {aiResult.missingInfo.missingFields.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {aiResult.missingInfo.missingFields.map((field) => (
                <span key={field} className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
                  {field.replace("_", " ")}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-4 text-white">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Reservation recommendation</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Recommended room</p>
              <p className="mt-1 text-lg font-semibold text-white">{recommendedRoom ?? "Review required"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Estimated total price</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {typeof estimatedTotal === "number" ? `${estimatedTotal} ${currency}` : "Pending"}
              </p>
            </div>
            {aiResult.availabilityPricing?.pricingNote ? (
              <p className="text-sm text-slate-300">{aiResult.availabilityPricing.pricingNote}</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">AI Suggested Reply</p>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
              {Math.round(aiResult.replySuggestion.confidence * 100)}% confidence
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">{aiResult.replySuggestion.message}</p>
        </div>

        {aiResult.reservationDraftSuggestion ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Create reservation</p>
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
