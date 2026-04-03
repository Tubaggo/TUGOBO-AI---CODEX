import { getLeadFilters } from "../../lib/mocks/leads-module";
import { getCrmI18n } from "../../lib/crm-translations";

type LeadsFilterBarProps = {
  current: {
    status?: string;
    assignedUser?: string;
    channel?: string;
    lead?: string;
  };
};

export function LeadsFilterBar({ current }: LeadsFilterBarProps) {
  const { copy, formatChannel, formatStatus } = getCrmI18n();
  const filters = getLeadFilters();

  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="text-sm text-slate-600">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slate-400">{copy.common.status}</span>
          <select
            name="status"
            defaultValue={current.status ?? ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">{copy.common.allStatuses}</option>
            {filters.statuses.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slate-400">
            {copy.leads.assignedUser}
          </span>
          <select
            name="assignedUser"
            defaultValue={current.assignedUser ?? ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">{copy.common.allTeamMembers}</option>
            {filters.assignedUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slate-400">{copy.common.channel}</span>
          <select
            name="channel"
            defaultValue={current.channel ?? ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">{copy.common.allChannels}</option>
            {filters.channels.map((channel) => (
              <option key={channel.id} value={channel.type}>
                {formatChannel(channel.type)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            {copy.common.applyFilters}
          </button>
          {current.lead ? <input type="hidden" name="lead" value={current.lead} /> : null}
        </div>
      </div>
    </form>
  );
}
