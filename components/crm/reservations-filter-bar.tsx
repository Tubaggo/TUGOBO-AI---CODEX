import { getCrmI18n } from "../../lib/crm-translations";

type ReservationsFilterBarProps = {
  currentStatus?: string;
  currentReservation?: string;
};

export function ReservationsFilterBar({
  currentStatus,
  currentReservation,
}: ReservationsFilterBarProps) {
  const { copy, formatStatus } = getCrmI18n();

  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[220px_auto]">
        <label className="text-sm text-slate-600">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slate-400">{copy.common.status}</span>
          <select
            name="status"
            defaultValue={currentStatus ?? ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">{copy.common.allStatuses}</option>
            <option value="pending">{formatStatus("pending")}</option>
            <option value="confirmed">{formatStatus("confirmed")}</option>
            <option value="canceled">{formatStatus("canceled")}</option>
          </select>
        </label>
        <div className="flex items-end gap-2">
          {currentReservation ? <input type="hidden" name="reservation" value={currentReservation} /> : null}
          <button
            type="submit"
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            {copy.common.applyFilter}
          </button>
        </div>
      </div>
    </form>
  );
}
