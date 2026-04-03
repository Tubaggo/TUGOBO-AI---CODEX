import { AssistantSettingsPanel } from "../../../components/crm/assistant-settings-panel";
import { AutomationFlowsPanel } from "../../../components/crm/automation-flows-panel";
import { KnowledgeBaseTable } from "../../../components/crm/knowledge-base-table";
import { getCrmI18n } from "../../../lib/crm-translations";

export default function SettingsPage() {
  const { copy } = getCrmI18n();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{copy.settings.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">{copy.settings.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          {copy.settings.description}
        </p>
      </div>

      <AssistantSettingsPanel />
      <KnowledgeBaseTable />
      <AutomationFlowsPanel />
    </div>
  );
}
