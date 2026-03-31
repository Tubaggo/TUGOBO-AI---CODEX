"use client";

import { useState } from "react";
import type { AssistantConfig, ConversationThread } from "../../lib/domain/types";
import type { AiReservationProcessingResult } from "../../lib/ai/types/ai-reservation.types";
import type { ReservationRecord } from "../../lib/mocks/reservations-module";
import { ConversationThreadView } from "./conversation-thread";
import { LeadInformationPanel } from "./lead-information-panel";

type ConversationsDemoShellProps = {
  thread: ConversationThread;
  aiResult: AiReservationProcessingResult;
  assistantConfig: AssistantConfig;
  tenantId: string;
  actorUserId: string;
  existingReservation: ReservationRecord | null;
  scenarioLabel: string | null;
};

export function ConversationsDemoShell({
  thread,
  aiResult,
  assistantConfig,
  tenantId,
  actorUserId,
  existingReservation,
  scenarioLabel,
}: ConversationsDemoShellProps) {
  const [analysisPulseKey, setAnalysisPulseKey] = useState(0);

  return (
    <>
      <div className="min-h-[720px]">
        <ConversationThreadView
          thread={thread}
          aiResult={aiResult}
          assistantConfig={assistantConfig}
          scenarioLabel={scenarioLabel}
          onAssistantMessageShown={() => setAnalysisPulseKey((current) => current + 1)}
        />
      </div>
      <div className="min-h-[720px]">
        <LeadInformationPanel
          thread={thread}
          aiResult={aiResult}
          tenantId={tenantId}
          actorUserId={actorUserId}
          existingReservation={existingReservation}
          scenarioLabel={scenarioLabel}
          analysisPulseKey={analysisPulseKey}
        />
      </div>
    </>
  );
}
