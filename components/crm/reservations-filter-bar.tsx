type ReservationsFilterBarProps = {
  currentStatus?: string;
  currentReservation?: string;
};

export function ReservationsFilterBar({
  currentStatus,
  currentReservation,
}: ReservationsFilterBarProps) {
  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[220px_auto]">
        <label className="text-sm text-slate-600">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slate-400">Status</span>
          <select
            name="status"
            defaultValue={currentStatus ?? ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="canceled">Cancelled</option>
          </select>
        </label>
        <div className="flex items-end gap-2">
          {currentReservation ? <input type="hidden" name="reservation" value={currentReservation} /> : null}
          <button
            type="submit"
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </form>
  );
}
