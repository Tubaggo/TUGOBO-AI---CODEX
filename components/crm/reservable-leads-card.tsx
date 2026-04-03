import Link from "next/link";
import { getCrmI18n } from "../../lib/crm-translations";
import { getReservableLeads } from "../../lib/mocks/reservations-module";

export function ReservableLeadsCard() {
  const { copy, formatDate } = getCrmI18n();
  const reservableLeads = getReservableLeads();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{copy.reservations.createFromExistingLeads}</h2>
          <p className="mt-1 text-xs text-slate-500">{copy.reservations.createFromExistingLeadsDescription}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {reservableLeads.map((item) => (
          <div key={item.lead.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{item.lead.fullName}</p>
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(item.lead.checkIn) ?? "-"} {copy.common.to} {formatDate(item.lead.checkOut) ?? "-"} ·{" "}
                {item.assignedUser?.fullName ?? copy.common.unassigned}
              </p>
            </div>
            <Link
              href={`/reservations?createFromLead=${item.lead.id}`}
              className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white"
            >
              {copy.reservations.createDraft}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
