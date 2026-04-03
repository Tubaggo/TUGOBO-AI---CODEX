import { assistantConfig } from "../../lib/mocks/settings-module";
import { getCrmI18n } from "../../lib/crm-translations";

export function AssistantSettingsPanel() {
  const { copy, formatLanguageCode, formatResponseStyle } = getCrmI18n();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{copy.settings.assistantTitle}</h2>
          <p className="mt-1 text-xs text-slate-500">{copy.settings.assistantDescription}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          {formatResponseStyle(assistantConfig.responseStyle)}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.settings.tone}</p>
          <p className="mt-1 text-sm text-slate-800">{assistantConfig.tone}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.settings.supportedLanguages}</p>
          <p className="mt-1 text-sm text-slate-800">
            {assistantConfig.supportedLanguages.map((language) => formatLanguageCode(language)).join(", ")}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.settings.businessHours}</p>
          <p className="mt-1 text-sm text-slate-800">{assistantConfig.businessHours?.timezone}</p>
        </div>
        <div className="md:col-span-2 xl:col-span-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.settings.welcomeMessage}</p>
          <p className="mt-1 text-sm text-slate-800">{assistantConfig.welcomeMessage}</p>
        </div>
        <div className="md:col-span-2 xl:col-span-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{copy.settings.fallbackMessage}</p>
          <p className="mt-1 text-sm text-slate-800">{assistantConfig.fallbackMessage}</p>
        </div>
      </div>
    </section>
  );
}
