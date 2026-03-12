import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BusinessSettingsForm } from "@/components/business-settings-form";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#f7f3eb] px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <Link href="/demo" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to demo
          </Link>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Simple admin</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight">Business settings</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A lightweight configuration view that shows hotel operators how Tugobo AI can be tuned to their property without exposing complex SaaS setup.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="ghost">
              <Link href="/leads">View leads</Link>
            </Button>
          </div>
        </div>
        <BusinessSettingsForm />
      </div>
    </main>
  );
}
