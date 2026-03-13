import type { ConversationThread } from "../../lib/domain";
import { StatusBadge } from "./status-badge";

type LeadInformationPanelProps = {
  thread: ConversationThread;
};

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value ?? "Not captured"}</p>
    </div>
  );
}

export function LeadInformationPanel({ thread }: LeadInformationPanelProps) {
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
      </div>
    </div>
  );
}
