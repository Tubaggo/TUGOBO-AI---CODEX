import Link from "next/link";
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
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Reservation</th>
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Stay</th>
              <th className="px-4 py-3 font-medium">Room Type</th>
              <th className="px-4 py-3 font-medium">Guests</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Assigned</th>
              <th className="px-4 py-3 font-medium">Last Activity</th>
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
                      {record.createdFromLead ? "Created from lead" : "Direct reservation"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{record.reservation.guestName}</td>
                  <td className="px-4 py-4 text-slate-700">
                    <div>{new Date(record.reservation.checkIn).toLocaleDateString("en-GB")}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {new Date(record.reservation.checkOut).toLocaleDateString("en-GB")}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{record.lead?.roomTypePreference ?? "Unassigned"}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {record.reservation.adultCount} adult{record.reservation.adultCount > 1 ? "s" : ""}
                    {record.reservation.childCount > 0 ? ` + ${record.reservation.childCount} child` : ""}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {record.reservation.totalPrice} {record.reservation.currency}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={record.reservation.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-700">{record.assignedUser?.fullName ?? "Unassigned"}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {record.lastActivityAt
                      ? new Date(record.lastActivityAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
