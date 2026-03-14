import { assistantConfig } from "../../lib/mocks/settings-module";

export function AssistantSettingsPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Assistant Settings</h2>
          <p className="mt-1 text-xs text-slate-500">Tenant-level AI behavior and handoff rules.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          {assistantConfig.responseStyle}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Tone</p>
          <p className="mt-1 text-sm text-slate-800">{assistantConfig.tone}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Supported Languages</p>
          <p className="mt-1 text-sm text-slate-800">{assistantConfig.supportedLanguages.join(", ")}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Business Hours</p>
          <p className="mt-1 text-sm text-slate-800">{assistantConfig.businessHours?.timezone}</p>
        </div>
        <div className="md:col-span-2 xl:col-span-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Welcome Message</p>
          <p className="mt-1 text-sm text-slate-800">{assistantConfig.welcomeMessage}</p>
        </div>
        <div className="md:col-span-2 xl:col-span-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Fallback Message</p>
          <p className="mt-1 text-sm text-slate-800">{assistantConfig.fallbackMessage}</p>
        </div>
      </div>
    </section>
  );
}
