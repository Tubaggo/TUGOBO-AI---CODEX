import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LeadsTable } from "@/components/leads-table";

export default function LeadsPage() {
  return (
    <main className="min-h-screen bg-[#f7f3eb] px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-3">
          <Link href="/demo" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to demo
          </Link>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Lead view</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight">Captured reservation leads</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A lightweight table showing how Tugobo AI turns reservation conversations into structured leads a hotel team can follow up on.
            </p>
          </div>
        </div>
        <LeadsTable />
      </div>
    </main>
  );
}
