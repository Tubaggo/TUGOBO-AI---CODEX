import Link from "next/link";
import { getCrmI18n } from "../../lib/crm-translations";
import type { ReservationRecord } from "../../lib/mocks/reservations-module";
import { StatusBadge } from "./status-badge";

type ReservationsTableProps = {
  records: ReservationRecord[];
  selectedReservationId: string;
  currentStatus?: string;
};

function hrefForReservation(reservationId: string, currentStatus?: string) {
  const params = new URLSearchParams();
  if (currentStatus) {
    params.set("status", currentStatus);
  }
  params.set("reservation", reservationId);
  return `/reservations?${params.toString()}`;
}

export function ReservationsTable({
  records,
  selectedReservationId,
  currentStatus,
}: ReservationsTableProps) {
  const { copy, formatDate, formatDateTime } = getCrmI18n();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">{copy.reservations.table.reservation}</th>
              <th className="px-4 py-3 font-medium">{copy.reservations.table.guest}</th>
              <th className="px-4 py-3 font-medium">{copy.reservations.table.stay}</th>
              <th className="px-4 py-3 font-medium">{copy.reservations.table.roomType}</th>
              <th className="px-4 py-3 font-medium">{copy.reservations.table.guests}</th>
              <th className="px-4 py-3 font-medium">{copy.reservations.table.price}</th>
              <th className="px-4 py-3 font-medium">{copy.reservations.table.status}</th>
              <th className="px-4 py-3 font-medium">{copy.reservations.table.assigned}</th>
              <th className="px-4 py-3 font-medium">{copy.reservations.table.lastActivity}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => {
              const selected = record.reservation.id === selectedReservationId;

              return (
                <tr key={record.reservation.id} className={selected ? "bg-slate-50" : "bg-white"}>
                  <td className="px-4 py-4">
                    <Link
                      href={hrefForReservation(record.reservation.id, currentStatus)}
                      className="block font-medium text-slate-900"
                    >
                      {record.reservation.reservationCode}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {record.createdFromLead ? copy.reservations.createdFromLead : copy.reservations.directReservation}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{record.reservation.guestName}</td>
                  <td className="px-4 py-4 text-slate-700">
                    <div>{formatDate(record.reservation.checkIn)}</div>
                    <div className="mt-1 text-xs text-slate-500">{formatDate(record.reservation.checkOut)}</div>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{record.lead?.roomTypePreference ?? copy.common.unassigned}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {record.reservation.adultCount} {copy.common.guests.toLocaleLowerCase("tr-TR")}
                    {record.reservation.childCount > 0
                      ? ` + ${record.reservation.childCount} ${copy.leads.children.toLocaleLowerCase("tr-TR")}`
                      : ""}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {record.reservation.totalPrice} {record.reservation.currency}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={record.reservation.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-700">{record.assignedUser?.fullName ?? copy.common.unassigned}</td>
                  <td className="px-4 py-4 text-slate-700">{formatDateTime(record.lastActivityAt) ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
