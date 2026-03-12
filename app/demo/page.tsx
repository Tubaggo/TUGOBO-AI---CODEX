import Link from "next/link";
import { ArrowLeft, Building2, CheckCircle2 } from "lucide-react";

import { DemoWorkspace } from "@/components/demo-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#f7f3eb] px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border bg-card/90 p-5 shadow-panel md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to landing page
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-semibold">Sales Demo</h1>
                <p className="text-muted-foreground">
                  Simulated WhatsApp conversation plus hotel-ready lead capture.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Demo-ready
            </Badge>
            <Button asChild variant="ghost">
              <Link href="/leads">Open leads</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/settings">Open business settings</Link>
            </Button>
          </div>
        </header>

        <DemoWorkspace />
      </div>
    </main>
  );
}
