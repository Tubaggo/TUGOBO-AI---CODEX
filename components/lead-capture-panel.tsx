"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { leadDraft, type LeadDraft } from "@/lib/demo-data";

type LeadCapturePanelProps = {
  scenario: string;
};

function getScenarioNotes(scenario: string, draft: LeadDraft) {
  if (scenario === "Add airport transfer") {
    return `${draft.notes} Arrival transfer requested in the conversation.`;
  }
  if (scenario === "Request a refundable rate") {
    return "Guest asked for a refundable option and should receive policy details in the follow-up.";
  }
  return draft.notes;
}

export function LeadCapturePanel({ scenario }: LeadCapturePanelProps) {
  const notes = useMemo(() => getScenarioNotes(scenario, leadDraft), [scenario]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Generated lead</CardTitle>
            <CardDescription>The captured reservation request ready for hotel follow-up</CardDescription>
          </div>
          <Badge variant="success">{leadDraft.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input value={leadDraft.guestName} readOnly />
          <Input value={leadDraft.email} readOnly />
          <Input value={leadDraft.phone} readOnly />
          <Input value={leadDraft.guests} readOnly />
          <Input value={leadDraft.checkIn} readOnly />
          <Input value={leadDraft.checkOut} readOnly />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input value={leadDraft.channel} readOnly />
          <Input value={leadDraft.roomPreference} readOnly />
        </div>
        <div className="rounded-[1.25rem] border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-slate-900">Conversation notes</p>
          <p className="mt-2">{notes}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="secondary">Generate lead</Button>
          <Button>Send to hotel team</Button>
        </div>
      </CardContent>
    </Card>
  );
}
