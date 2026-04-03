import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCrmI18n } from "../../lib/crm-translations";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { copy } = getCrmI18n();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-200 bg-slate-950 px-6 py-8 text-slate-100">
          <div className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <Image
              src="/logo/tugobo-logo.png"
              alt="Tugobo AI"
              width={168}
              height={42}
              className="h-auto w-[144px]"
              priority
            />
          </div>
          <h1 className="mt-5 text-xl font-semibold">{copy.layout.workspace}</h1>
          <nav className="mt-8 space-y-2 text-sm">
            <Link className="block rounded-xl px-3 py-2 text-slate-200 hover:bg-slate-900" href="/dashboard">
              {copy.layout.overview}
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-slate-200 hover:bg-slate-900" href="/conversations">
              {copy.layout.conversations}
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-slate-400 hover:bg-slate-900" href="/leads">
              {copy.layout.leads}
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-slate-400 hover:bg-slate-900" href="/reservations">
              {copy.layout.reservations}
            </Link>
            <Link className="block rounded-xl px-3 py-2 text-slate-400 hover:bg-slate-900" href="/settings">
              {copy.layout.settings}
            </Link>
          </nav>
        </aside>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{copy.layout.tenantContext}</p>
                <h2 className="mt-1 text-lg font-semibold">{copy.layout.tenantName}</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{copy.layout.demoMode}</div>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
