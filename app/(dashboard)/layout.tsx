import type { ReactNode } from "react";
import Link from "next/link";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-200 bg-slate-950 px-6 py-8 text-slate-100">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Tugobo AI</p>
          <h1 className="mt-3 text-xl font-semibold">CRM Workspace</h1>
          <nav className="mt-8 space-y-2 text-sm">
            <Link className="block rounded-xl px-3 py-2 text-slate-200 hover:bg-slate-900" href="/dashboard">
              Overview
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-slate-200 hover:bg-slate-900" href="/conversations">
              Conversations
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-slate-400 hover:bg-slate-900" href="/leads">
              Leads
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-slate-400 hover:bg-slate-900" href="/reservations">
              Reservations
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-slate-400 hover:bg-slate-900" href="/settings">
              Settings
            </Link>
          </nav>
        </aside>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Tenant Context</p>
                <h2 className="mt-1 text-lg font-semibold">Blue Cove Hotel</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">Demo Mode</div>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
