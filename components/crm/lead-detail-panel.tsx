import Link from "next/link";
import { getCrmI18n } from "../../lib/crm-translations";
import type { LeadRecord } from "../../lib/mocks/leads-module";
import { ChannelBadge } from "./channel-badge";
import { StatusBadge } from "./status-badge";

type LeadDetailPanelProps = {
  record: LeadRecord;
};

function DetailField({ label, value }: { label: string; value: string | number | null | undefined }) {
  const { copy } = getCrmI18n();

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value ?? copy.common.notCaptured}</p>
    </div>
  );
}

export function LeadDetailPanel({ record }: LeadDetailPanelProps) {
  const { copy, formatDate, formatDateTime, formatPriority, formatStatus } = getCrmI18n();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{record.lead.fullName}</h2>
            <p className="mt-1 text-xs text-slate-500">{record.lead.email ?? record.lead.phone ?? copy.common.noContact}</p>
          </div>
          <StatusBadge status={record.lead.status} />
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="flex flex-wrap items-center gap-2">
          {record.channel ? <ChannelBadge channel={record.channel.type} /> : null}
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
            {record.assignedUser?.fullName ?? copy.common.unassigned}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailField label={copy.common.checkIn} value={formatDate(record.lead.checkIn)} />
          <DetailField label={copy.common.checkOut} value={formatDate(record.lead.checkOut)} />
          <DetailField label={copy.leads.guestCount} value={record.lead.guestCount} />
          <DetailField label={copy.leads.children} value={record.lead.childCount} />
          <DetailField
            label={copy.common.estimatedValue}
            value={record.lead.estimatedValue ? `${record.lead.estimatedValue} ${record.lead.currency}` : null}
          />
          <DetailField label={copy.common.lastActivity} value={formatDateTime(record.lead.lastActivityAt)} />
          <DetailField label={copy.leads.roomPreference} value={record.lead.roomTypePreference} />
          <DetailField label={copy.leads.priority} value={formatPriority(record.lead.priority)} />
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.common.connectedRecords}</p>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              {copy.layout.conversations}:{" "}
              {record.conversation ? (
                <Link className="font-medium text-slate-950 underline" href={`/conversations?conversation=${record.conversation.id}`}>
                  {record.conversation.guestName ?? record.conversation.id}
                </Link>
              ) : (
                copy.common.noLinkedConversation
              )}
            </p>
            <p>
              {copy.layout.reservations}:{" "}
              {record.reservation ? (
                <span>
                  {record.reservation.reservationCode} ({formatStatus(record.reservation.status)})
                </span>
              ) : (
                copy.common.noReservationYet
              )}
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.leads.tags}</p>
          <div className="flex flex-wrap gap-2">
            {record.lead.tags.length > 0 ? (
              record.lead.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">{copy.common.noTagsAssigned}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
