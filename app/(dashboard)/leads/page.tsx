import { LeadDetailPanel } from "../../../components/crm/lead-detail-panel";
import { LeadsFilterBar } from "../../../components/crm/leads-filter-bar";
import { LeadsTable } from "../../../components/crm/leads-table";
import { getLeadRecord, listLeadRecords } from "../../../lib/mocks/leads-module";

type LeadsPageProps = {
  searchParams?: Promise<{
    status?: string;
    assignedUser?: string;
    channel?: string;
    lead?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = searchParams ? await searchParams : {};
  const records = listLeadRecords({
    status: params.status as
      | "new"
      | "qualified"
      | "offer_sent"
      | "won"
      | "lost"
      | undefined,
    assignedUserId: params.assignedUser,
    channel: params.channel as "whatsapp" | "instagram" | "webchat" | undefined,
  });

  const selectedLeadId =
    records.find((record) => record.lead.id === params.lead)?.lead.id ?? records[0]?.lead.id;
  const selectedRecord = selectedLeadId ? getLeadRecord(selectedLeadId) : null;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Leads CRM</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Lead Management</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Track reservation opportunities, qualify guests, and follow the link between conversation and booking.
        </p>
      </div>

      <LeadsFilterBar
        current={{
          status: params.status,
          assignedUser: params.assignedUser,
          channel: params.channel,
          lead: selectedLeadId,
        }}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <LeadsTable
          records={records}
          selectedLeadId={selectedLeadId ?? ""}
          currentFilters={{
            status: params.status,
            assignedUser: params.assignedUser,
            channel: params.channel,
          }}
        />
        {selectedRecord ? (
          <LeadDetailPanel record={selectedRecord} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            No lead matches the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
