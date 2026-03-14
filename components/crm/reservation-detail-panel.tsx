import Link from "next/link";
import type { ReservationRecord } from "../../lib/mocks/reservations-module";
import { StatusBadge } from "./status-badge";

type ReservationDetailPanelProps = {
  record: ReservationRecord;
};

function DetailField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value ?? "Not captured"}</p>
    </div>
  );
}

export function ReservationDetailPanel({ record }: ReservationDetailPanelProps) {
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
          <DetailField
            label="Check-in"
            value={new Date(record.reservation.checkIn).toLocaleDateString("en-GB")}
          />
          <DetailField
            label="Check-out"
            value={new Date(record.reservation.checkOut).toLocaleDateString("en-GB")}
          />
          <DetailField label="Room Type" value={record.lead?.roomTypePreference} />
          <DetailField
            label="Guest Count"
            value={`${record.reservation.adultCount} adult${record.reservation.adultCount > 1 ? "s" : ""}${
              record.reservation.childCount > 0 ? ` + ${record.reservation.childCount} child` : ""
            }`}
          />
          <DetailField
            label="Total Price"
            value={`${record.reservation.totalPrice} ${record.reservation.currency}`}
          />
          <DetailField label="Assigned Staff" value={record.assignedUser?.fullName} />
          <DetailField label="Last Activity" value={record.lastActivityAt ? new Date(record.lastActivityAt).toLocaleString("en-GB") : null} />
          <DetailField label="Linked Lead" value={record.lead?.fullName} />
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Connected Records</p>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              Lead:{" "}
              {record.lead ? (
                <Link className="font-medium text-slate-950 underline" href={`/leads?lead=${record.lead.id}`}>
                  {record.lead.fullName}
                </Link>
              ) : (
                "No linked lead"
              )}
            </p>
            <p>
              Conversation:{" "}
              {record.conversation ? (
                <Link
                  className="font-medium text-slate-950 underline"
                  href={`/conversations?conversation=${record.conversation.id}`}
                >
                  {record.conversation.guestName ?? record.conversation.id}
                </Link>
              ) : (
                "No linked conversation"
              )}
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Staff Notes</p>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            {record.reservation.notes ?? "No staff notes yet."}
          </div>
        </div>
      </div>
    </div>
  );
}
