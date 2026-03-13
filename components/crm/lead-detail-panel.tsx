import Link from "next/link";
import type { LeadRecord } from "../../lib/mocks/leads-module";
import { ChannelBadge } from "./channel-badge";
import { StatusBadge } from "./status-badge";

type LeadDetailPanelProps = {
  record: LeadRecord;
};

function DetailField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value ?? "Not captured"}</p>
    </div>
  );
}

export function LeadDetailPanel({ record }: LeadDetailPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{record.lead.fullName}</h2>
            <p className="mt-1 text-xs text-slate-500">{record.lead.email ?? record.lead.phone ?? "No contact"}</p>
          </div>
          <StatusBadge status={record.lead.status} />
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="flex flex-wrap items-center gap-2">
          {record.channel ? <ChannelBadge channel={record.channel.type} /> : null}
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
            {record.assignedUser?.fullName ?? "Unassigned"}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailField
            label="Check-in"
            value={record.lead.checkIn ? new Date(record.lead.checkIn).toLocaleDateString("en-GB") : null}
          />
          <DetailField
            label="Check-out"
            value={record.lead.checkOut ? new Date(record.lead.checkOut).toLocaleDateString("en-GB") : null}
          />
          <DetailField label="Guest Count" value={record.lead.guestCount} />
          <DetailField label="Children" value={record.lead.childCount} />
          <DetailField label="Estimated Value" value={record.lead.estimatedValue ? `${record.lead.estimatedValue} ${record.lead.currency}` : null} />
          <DetailField label="Last Activity" value={record.lead.lastActivityAt ? new Date(record.lead.lastActivityAt).toLocaleString("en-GB") : null} />
          <DetailField label="Room Preference" value={record.lead.roomTypePreference} />
          <DetailField label="Priority" value={record.lead.priority} />
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Connected Records</p>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              Conversation:{" "}
              {record.conversation ? (
                <Link className="font-medium text-slate-950 underline" href={`/conversations?conversation=${record.conversation.id}`}>
                  {record.conversation.guestName ?? record.conversation.id}
                </Link>
              ) : (
                "No linked conversation"
              )}
            </p>
            <p>
              Reservation:{" "}
              {record.reservation ? (
                <span>
                  {record.reservation.reservationCode} ({record.reservation.status})
                </span>
              ) : (
                "No reservation yet"
              )}
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Tags</p>
          <div className="flex flex-wrap gap-2">
            {record.lead.tags.length > 0 ? (
              record.lead.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">No tags assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
