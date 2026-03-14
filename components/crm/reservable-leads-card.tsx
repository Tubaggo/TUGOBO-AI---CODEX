import Link from "next/link";
import { getReservableLeads } from "../../lib/mocks/reservations-module";

export function ReservableLeadsCard() {
  const reservableLeads = getReservableLeads();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Create From Existing Leads</h2>
          <p className="mt-1 text-xs text-slate-500">
            Eligible leads with stay dates but no reservation record yet.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {reservableLeads.map((item) => (
          <div key={item.lead.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{item.lead.fullName}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.lead.checkIn ? new Date(item.lead.checkIn).toLocaleDateString("en-GB") : "-"} to{" "}
                {item.lead.checkOut ? new Date(item.lead.checkOut).toLocaleDateString("en-GB") : "-"} ·{" "}
                {item.assignedUser?.fullName ?? "Unassigned"}
              </p>
            </div>
            <Link
              href={`/reservations?createFromLead=${item.lead.id}`}
              className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white"
            >
              Create Draft
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
