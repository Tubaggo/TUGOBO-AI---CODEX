import Link from "next/link";
import { getCrmI18n } from "../../lib/crm-translations";
import type { ReservationRecord } from "../../lib/mocks/reservations-module";
import { StatusBadge } from "./status-badge";

type ReservationDetailPanelProps = {
  record: ReservationRecord;
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

export function ReservationDetailPanel({ record }: ReservationDetailPanelProps) {
  const { copy, formatDate, formatDateTime } = getCrmI18n();
  const guestCount = `${record.reservation.adultCount} ${copy.common.guests.toLocaleLowerCase("tr-TR")}${
    record.reservation.childCount > 0
      ? ` + ${record.reservation.childCount} ${copy.leads.children.toLocaleLowerCase("tr-TR")}`
      : ""
  }`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{record.reservation.reservationCode}</h2>
            <p className="mt-1 text-xs text-slate-500">{record.reservation.guestName}</p>
          </div>
          <StatusBadge status={record.reservation.status} />
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailField label={copy.common.checkIn} value={formatDate(record.reservation.checkIn)} />
          <DetailField label={copy.common.checkOut} value={formatDate(record.reservation.checkOut)} />
          <DetailField label={copy.reservations.roomType} value={record.lead?.roomTypePreference} />
          <DetailField label={copy.reservations.guestCount} value={guestCount} />
          <DetailField label={copy.reservations.totalPrice} value={`${record.reservation.totalPrice} ${record.reservation.currency}`} />
          <DetailField label={copy.reservations.assignedStaff} value={record.assignedUser?.fullName} />
          <DetailField label={copy.common.lastActivity} value={formatDateTime(record.lastActivityAt)} />
          <DetailField label={copy.reservations.linkedLead} value={record.lead?.fullName} />
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.common.connectedRecords}</p>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              {copy.layout.leads}:{" "}
              {record.lead ? (
                <Link className="font-medium text-slate-950 underline" href={`/leads?lead=${record.lead.id}`}>
                  {record.lead.fullName}
                </Link>
              ) : (
                copy.common.noLinkedLead
              )}
            </p>
            <p>
              {copy.layout.conversations}:{" "}
              {record.conversation ? (
                <Link
                  className="font-medium text-slate-950 underline"
                  href={`/conversations?conversation=${record.conversation.id}`}
                >
                  {record.conversation.guestName ?? record.conversation.id}
                </Link>
              ) : (
                copy.common.noLinkedConversation
              )}
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.reservations.staffNotes}</p>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            {record.reservation.notes ?? copy.common.noStaffNotesYet}
          </div>
        </div>
      </div>
    </div>
  );
}
