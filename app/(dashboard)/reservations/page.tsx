import { ReservationDetailPanel } from "../../../components/crm/reservation-detail-panel";
import { ReservationsFilterBar } from "../../../components/crm/reservations-filter-bar";
import { ReservationsTable } from "../../../components/crm/reservations-table";
import { ReservableLeadsCard } from "../../../components/crm/reservable-leads-card";
import {
  createDraftReservationFromLead,
  getReservationRecord,
  listReservationRecords,
} from "../../../lib/mocks/reservations-module";

type ReservationsPageProps = {
  searchParams?: Promise<{
    status?: string;
    reservation?: string;
    createFromLead?: string;
  }>;
};

export default async function ReservationsPage({ searchParams }: ReservationsPageProps) {
  const params = searchParams ? await searchParams : {};
  const records = listReservationRecords({
    status: params.status as "pending" | "confirmed" | "canceled" | undefined,
  });

  const selectedReservationId =
    records.find((record) => record.reservation.id === params.reservation)?.reservation.id ??
    records[0]?.reservation.id;

  const selectedRecord =
    (params.createFromLead ? createDraftReservationFromLead(params.createFromLead) : null) ??
    (selectedReservationId ? getReservationRecord(selectedReservationId) : null);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Reservations CRM</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Reservations Management</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Manage booking records linked to conversation-driven leads, monitor reservation statuses,
          and prepare staff follow-up.
        </p>
      </div>

      <ReservationsFilterBar
        currentStatus={params.status}
        currentReservation={selectedReservationId}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <ReservationsTable
            records={records}
            selectedReservationId={selectedReservationId ?? ""}
            currentStatus={params.status}
          />
          <ReservableLeadsCard />
        </div>
        {selectedRecord ? (
          <ReservationDetailPanel record={selectedRecord} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            No reservation matches the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
