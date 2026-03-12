"use client";

import { useState } from "react";

import { DemoChat } from "@/components/demo-chat";
import { LeadCapturePanel } from "@/components/lead-capture-panel";

export function DemoWorkspace() {
  const [scenario, setScenario] = useState("Ask for breakfast included");

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <DemoChat onScenarioChange={setScenario} />
      <LeadCapturePanel scenario={scenario} />
    </div>
  );
}
