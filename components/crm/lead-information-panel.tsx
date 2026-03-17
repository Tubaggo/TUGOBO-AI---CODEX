import type { ConversationThread } from "../../lib/domain";
import type { AiReservationProcessingResult } from "../../lib/ai";
import type { ReservationRecord } from "../../lib/mocks/reservations-module";
import { CreateReservationAction } from "./create-reservation-action";
import { StatusBadge } from "./status-badge";

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
  const lead = thread.lead;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Lead Panel</h2>
        <p className="mt-1 text-xs text-slate-500">Extracted reservation details and staff notes.</p>
      </div>

      <div className="space-y-5 overflow-y-auto px-5 py-5">
        <div className="space-y-3">
          <Field label="Guest" value={lead?.fullName ?? thread.conversation.guestName} />
          <Field label="Email" value={lead?.email ?? thread.conversation.guestEmail} />
          <Field label="Phone" value={lead?.phone ?? thread.conversation.guestPhone} />
          <Field label="Language" value={lead?.language ?? thread.conversation.guestLanguage} />
        </div>

        {lead ? (
          <>
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <Field label="Check-in" value={lead.checkIn ? new Date(lead.checkIn).toLocaleDateString("en-GB") : null} />
              <Field label="Check-out" value={lead.checkOut ? new Date(lead.checkOut).toLocaleDateString("en-GB") : null} />
              <Field label="Guests" value={lead.guestCount} />
              <Field label="Children" value={lead.childCount} />
              <Field label="Room" value={lead.roomTypePreference} />
              <Field label="Budget" value={lead.budget ? `${lead.budget} ${lead.currency}` : null} />
              <Field
                label="Estimated value"
                value={lead.estimatedValue ? `${lead.estimatedValue} ${lead.currency}` : null}
              />
            </div>
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Lead status</p>
                <StatusBadge status={lead.status} />
              </div>
              <Field label="Priority" value={lead.priority} />
              <Field label="Temperature" value={lead.temperature} />
              <Field label="Tags" value={lead.tags.join(", ")} />
            </div>
          </>
        ) : null}

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Internal notes</p>
          {thread.internalNotes.length > 0 ? (
            thread.internalNotes.map((note) => (
              <div key={note.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-700">{note.content}</p>
                <p className="mt-2 text-[11px] text-slate-400">
                  {new Date(note.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No internal notes yet.</p>
          )}
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">AI Reservation Brain</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Detected Intent" value={aiResult.intent.replace("_", " ")} />
            <Field label="Lead Score" value={`${aiResult.leadScore.score} / 100`} />
            <Field label="Qualification" value={aiResult.qualification.replace("_", " ")} />
            <Field label="Next Action" value={aiResult.nextAction.replace("_", " ")} />
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Extracted Fields</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Guest Name" value={aiResult.entities.guestName} />
            <Field label="Phone" value={aiResult.entities.phone} />
            <Field label="Email" value={aiResult.entities.email} />
            <Field label="Language" value={aiResult.entities.language} />
            <Field
              label="Check-in"
              value={
                aiResult.entities.checkIn ? new Date(aiResult.entities.checkIn).toLocaleDateString("en-GB") : null
              }
            />
            <Field
              label="Check-out"
              value={
                aiResult.entities.checkOut ? new Date(aiResult.entities.checkOut).toLocaleDateString("en-GB") : null
              }
            />
            <Field label="Guests" value={aiResult.entities.guestCount} />
            <Field label="Children" value={aiResult.entities.childCount} />
            <Field label="Room Preference" value={aiResult.entities.roomTypePreference} />
            <Field label="Budget" value={aiResult.entities.budget ? `${aiResult.entities.budget} EUR` : null} />
          </div>
          <Field label="Special Requests" value={aiResult.entities.specialRequests.join(", ")} />
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Missing Information</p>
          {aiResult.missingInfo.missingFields.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {aiResult.missingInfo.missingFields.map((field) => (
                <span key={field} className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
                  {field.replace("_", " ")}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-emerald-700">All required reservation details are available.</p>
          )}
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Suggested AI Reply</p>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{aiResult.replySuggestion.message}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
              {aiResult.replySuggestion.type.replace("_", " ")}
            </p>
          </div>
        </div>

        {aiResult.availabilityPricing ? (
          <div className="space-y-3 border-t border-slate-100 pt-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Availability & Pricing</p>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                <span className="font-medium">Suggested room:</span>{" "}
                {aiResult.availabilityPricing.suggestedBestFit?.roomType.name ?? "No match"}
              </p>
              <p className="mt-2">
                <span className="font-medium">Estimated total:</span>{" "}
                {aiResult.availabilityPricing.estimatedTotalPrice
                  ? `${aiResult.availabilityPricing.estimatedTotalPrice} ${aiResult.availabilityPricing.suggestedBestFit?.roomType.currency ?? "EUR"}`
                  : "Pending"}
              </p>
              <p className="mt-2">
                <span className="font-medium">Fallback option:</span>{" "}
                {aiResult.availabilityPricing.fallbackOption?.roomType.name ?? "No fallback needed"}
              </p>
              <p className="mt-2">
                <span className="font-medium">Pricing note:</span> {aiResult.availabilityPricing.pricingNote}
              </p>
            </div>
          </div>
        ) : null}

        {aiResult.reservationDraftSuggestion ? (
          <div className="space-y-3 border-t border-slate-100 pt-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Reservation Draft Suggestion</p>
            <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700">
              <p>
                <span className="font-medium">Candidate room:</span>{" "}
                {aiResult.reservationDraftSuggestion.candidateRoomType}
              </p>
              <p className="mt-2">
                <span className="font-medium">Estimated price:</span>{" "}
                {aiResult.reservationDraftSuggestion.estimatedPrice
                  ? `${aiResult.reservationDraftSuggestion.estimatedPrice} ${aiResult.reservationDraftSuggestion.currency}`
                  : "Pending"}
              </p>
              <p className="mt-2">
                <span className="font-medium">Confidence:</span>{" "}
                {Math.round(aiResult.reservationDraftSuggestion.confidence * 100)}%
              </p>
              <p className="mt-2">{aiResult.reservationDraftSuggestion.notes}</p>
            </div>
            <CreateReservationAction
              tenantId={tenantId}
              actorUserId={actorUserId}
              conversationId={thread.conversation.id}
              leadId={aiResult.reservationDraftSuggestion.linkedLeadId}
              adultCount={aiResult.entities.guestCount ?? aiResult.reservationDraftSuggestion.guestCount}
              childCount={aiResult.entities.childCount ?? lead?.childCount ?? 0}
              draft={aiResult.reservationDraftSuggestion}
              existingReservation={existingReservation}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
