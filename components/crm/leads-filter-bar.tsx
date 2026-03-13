import { getLeadFilters } from "../../lib/mocks/leads-module";

type LeadsFilterBarProps = {
  current: {
    status?: string;
    assignedUser?: string;
    channel?: string;
    lead?: string;
  };
};

export function LeadsFilterBar({ current }: LeadsFilterBarProps) {
  const filters = getLeadFilters();

  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="text-sm text-slate-600">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slate-400">Status</span>
          <select
            name="status"
            defaultValue={current.status ?? ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">All statuses</option>
            {filters.statuses.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slate-400">
            Assigned User
          </span>
          <select
            name="assignedUser"
            defaultValue={current.assignedUser ?? ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">All team members</option>
            {filters.assignedUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slate-400">Channel</span>
          <select
            name="channel"
            defaultValue={current.channel ?? ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">All channels</option>
            {filters.channels.map((channel) => (
              <option key={channel.id} value={channel.type}>
                {channel.displayName}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Apply Filters
          </button>
          {current.lead ? <input type="hidden" name="lead" value={current.lead} /> : null}
        </div>
      </div>
    </form>
  );
}
