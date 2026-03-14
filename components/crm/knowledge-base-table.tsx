import { knowledgeBaseEntries } from "../../lib/mocks/settings-module";

export function KnowledgeBaseTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Knowledge Base</h2>
        <p className="mt-1 text-xs text-slate-500">Property content used by the assistant for reservation replies.</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Language</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {knowledgeBaseEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-900">{entry.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{entry.content}</p>
                </td>
                <td className="px-4 py-4 text-slate-700">{entry.category.replace("_", " ")}</td>
                <td className="px-4 py-4 text-slate-700">{entry.language}</td>
                <td className="px-4 py-4 text-slate-700">{entry.isActive ? "Active" : "Inactive"}</td>
                <td className="px-4 py-4 text-slate-700">
                  {new Date(entry.updatedAt).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
