import Link from "next/link";
import { getOverviewAnalytics } from "../../lib/mocks/leads-module";
import { ChannelBadge } from "./channel-badge";
import { StatusBadge } from "./status-badge";

export function AnalyticsOverview() {
  const analytics = getOverviewAnalytics();
  const maxChannelCount = Math.max(...analytics.channelDistribution.map((item) => item.count), 1);
  const maxStatusCount = Math.max(...analytics.statusDistribution.map((item) => item.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Dashboard Overview</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Reservation CRM Analytics</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Snapshot of active conversations, pipeline health, and recent reservation activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {analytics.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-500">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Channel Distribution</h2>
          <div className="mt-5 space-y-4">
            {analytics.channelDistribution.map((item) => (
              <div key={item.channel}>
                <div className="flex items-center justify-between">
                  <ChannelBadge channel={item.channel} />
                  <span className="text-sm text-slate-600">{item.count} leads</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-slate-900"
                    style={{ width: `${(item.count / maxChannelCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Lead Funnel</h2>
          <div className="mt-5 space-y-4">
            {analytics.statusDistribution.map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between">
                  <StatusBadge status={item.status} />
                  <span className="text-sm text-slate-600">{item.count}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${(item.count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent Leads</h2>
            <Link className="text-sm text-slate-600 underline" href="/leads">
              View leads
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {analytics.recentLeads.map((item) => (
              <div key={item.lead.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.lead.fullName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.assignedUser?.fullName ?? "Unassigned"} · {item.lead.estimatedValue ?? "-"} {item.lead.currency}
                    </p>
                  </div>
                  <StatusBadge status={item.lead.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent Conversations</h2>
            <Link className="text-sm text-slate-600 underline" href="/conversations">
              Open inbox
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {analytics.recentConversations.map((item) => (
              <div key={item.conversation.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.conversation.guestName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.conversation.intent?.replace("_", " ") ?? "general inquiry"}
                    </p>
                  </div>
                  <ChannelBadge channel={item.conversation.source} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
