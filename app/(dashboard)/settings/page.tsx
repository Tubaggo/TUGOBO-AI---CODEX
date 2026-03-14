import { AssistantSettingsPanel } from "../../../components/crm/assistant-settings-panel";
import { AutomationFlowsPanel } from "../../../components/crm/automation-flows-panel";
import { KnowledgeBaseTable } from "../../../components/crm/knowledge-base-table";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Assistant Admin</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Assistant, Knowledge, and Automations</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Configure the reservation assistant, curate property knowledge, and manage CRM automations.
        </p>
      </div>

      <AssistantSettingsPanel />
      <KnowledgeBaseTable />
      <AutomationFlowsPanel />
    </div>
  );
}
