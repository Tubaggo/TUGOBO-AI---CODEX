import { automationFlows } from "../../lib/mocks/settings-module";

export function AutomationFlowsPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Automation Flows</h2>
        <p className="mt-1 text-xs text-slate-500">Operational automations supporting intake, handoff, and follow-up.</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {automationFlows.map((flow) => (
          <div key={flow.id} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{flow.name}</p>
              <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-600">
                {flow.isActive ? "Active" : "Paused"}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{flow.description}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">
              {flow.flowType.replace("_", " ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
