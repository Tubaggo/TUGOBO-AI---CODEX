import type { ConversationStatus, LeadStatus, ReservationStatus } from "../../lib/domain/types";
import { getCrmI18n } from "../../lib/crm-translations";

const styles: Record<ConversationStatus | LeadStatus | ReservationStatus, string> = {
  open: "bg-blue-50 text-blue-700 ring-blue-200",
  waiting: "bg-amber-50 text-amber-700 ring-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  archived: "bg-slate-100 text-slate-600 ring-slate-200",
  human_handling: "bg-violet-50 text-violet-700 ring-violet-200",
  new: "bg-sky-50 text-sky-700 ring-sky-200",
  qualified: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  offer_sent: "bg-amber-50 text-amber-700 ring-amber-200",
  won: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  lost: "bg-rose-50 text-rose-700 ring-rose-200",
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  canceled: "bg-rose-50 text-rose-700 ring-rose-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function StatusBadge({ status }: { status: ConversationStatus | LeadStatus | ReservationStatus }) {
  const { formatStatus } = getCrmI18n();

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ring-1 ${styles[status]}`}>
      {formatStatus(status)}
    </span>
  );
}
