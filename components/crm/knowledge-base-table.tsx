import { knowledgeBaseEntries } from "../../lib/mocks/settings-module";
import { getCrmI18n } from "../../lib/crm-translations";

export function KnowledgeBaseTable() {
  const { copy, formatDate, formatKnowledgeBaseCategory, formatLanguageCode } = getCrmI18n();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{copy.settings.knowledgeBaseTitle}</h2>
        <p className="mt-1 text-xs text-slate-500">{copy.settings.knowledgeBaseDescription}</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">{copy.settings.titleColumn}</th>
              <th className="px-4 py-3 font-medium">{copy.settings.categoryColumn}</th>
              <th className="px-4 py-3 font-medium">{copy.settings.languageColumn}</th>
              <th className="px-4 py-3 font-medium">{copy.settings.statusColumn}</th>
              <th className="px-4 py-3 font-medium">{copy.settings.updatedColumn}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {knowledgeBaseEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-900">{entry.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{entry.content}</p>
                </td>
                <td className="px-4 py-4 text-slate-700">{formatKnowledgeBaseCategory(entry.category)}</td>
                <td className="px-4 py-4 text-slate-700">{formatLanguageCode(entry.language)}</td>
                <td className="px-4 py-4 text-slate-700">{entry.isActive ? copy.common.active : copy.common.inactive}</td>
                <td className="px-4 py-4 text-slate-700">
                  {formatDate(entry.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
