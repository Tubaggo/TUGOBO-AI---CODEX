import Link from "next/link";
import type { LeadRecord } from "../../lib/mocks/leads-module";
import { ChannelBadge } from "./channel-badge";
import { StatusBadge } from "./status-badge";

type LeadsTableProps = {
  records: LeadRecord[];
  selectedLeadId: string;
  currentFilters: {
    status?: string;
    assignedUser?: string;
    channel?: string;
  };
};

function buildHref(baseLeadId: string, currentFilters: LeadsTableProps["currentFilters"]) {
  const params = new URLSearchParams();
  if (currentFilters.status) params.set("status", currentFilters.status);
  if (currentFilters.assignedUser) params.set("assignedUser", currentFilters.assignedUser);
  if (currentFilters.channel) params.set("channel", currentFilters.channel);
  params.set("lead", baseLeadId);
  return `/leads?${params.toString()}`;
}

export function LeadsTable({ records, selectedLeadId, currentFilters }: LeadsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Stay</th>
              <th className="px-4 py-3 font-medium">Guests</th>
              <th className="px-4 py-3 font-medium">Estimated Value</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Assigned</th>
              <th className="px-4 py-3 font-medium">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => {
              const selected = record.lead.id === selectedLeadId;

              return (
                <tr key={record.lead.id} className={selected ? "bg-slate-50" : "bg-white"}>
                  <td className="px-4 py-4">
                    <Link
                      href={buildHref(record.lead.id, currentFilters)}
                      className="block font-medium text-slate-900"
                    >
                      {record.lead.fullName ?? "Unknown guest"}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">{record.lead.email ?? record.lead.phone ?? "-"}</p>
                  </td>
                  <td className="px-4 py-4">
                    {record.channel ? <ChannelBadge channel={record.channel.type} /> : <span>-</span>}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    <div>{record.lead.checkIn ? new Date(record.lead.checkIn).toLocaleDateString("en-GB") : "-"}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {record.lead.checkOut ? new Date(record.lead.checkOut).toLocaleDateString("en-GB") : "-"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {record.lead.guestCount ?? "-"}
                    {typeof record.lead.childCount === "number" ? ` + ${record.lead.childCount} child` : ""}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {record.lead.estimatedValue ? `${record.lead.estimatedValue} ${record.lead.currency}` : "-"}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={record.lead.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-700">{record.assignedUser?.fullName ?? "Unassigned"}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {record.lead.lastActivityAt
                      ? new Date(record.lead.lastActivityAt).toLocaleString("en-GB", {
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
