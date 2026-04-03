"use client";

import { useMemo, useState } from "react";
import type { DemoScenarioId } from "../../lib/crm-translations";
import type { AssistantConfig, ConversationThread } from "../../lib/domain/types";
import type { AiReservationProcessingResult } from "../../lib/ai/types/ai-reservation.types";
import type { ReservationRecord } from "../../lib/mocks/reservations-module";
import {
  createDemoThread,
  getConversationDemoScenario,
  type DemoTimelineState,
} from "../../lib/conversation-demo";
import { ConversationThreadView } from "./conversation-thread";
import { LeadInformationPanel } from "./lead-information-panel";

type ConversationsDemoShellProps = {
  thread: ConversationThread;
  aiResult: AiReservationProcessingResult;
  assistantConfig: AssistantConfig;
  tenantId: string;
  actorUserId: string;
  existingReservation: ReservationRecord | null;
  scenarioLabel: DemoScenarioId | null;
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
  const [timeline, setTimeline] = useState<DemoTimelineState>({
    visibleCount: 0,
    totalCount: thread.messages.length,
    isTyping: false,
    nextMessageSender: null,
    latestVisibleMessage: null,
  });
  const demoThread = useMemo(() => createDemoThread(thread, scenarioLabel), [thread, scenarioLabel]);
  const demoScenario = useMemo(
    () => getConversationDemoScenario(scenarioLabel, demoThread, aiResult),
    [scenarioLabel, demoThread, aiResult],
  );

  return (
    <>
      <div className="min-h-[720px]">
        <ConversationThreadView
          thread={demoThread}
          aiResult={aiResult}
          assistantConfig={assistantConfig}
          scenarioLabel={scenarioLabel}
          demoScenario={demoScenario}
          onAssistantMessageShown={() => setAnalysisPulseKey((current) => current + 1)}
          onTimelineChange={setTimeline}
        />
      </div>
      <div className="min-h-[720px]">
        <LeadInformationPanel
          thread={demoThread}
          aiResult={aiResult}
          tenantId={tenantId}
          actorUserId={actorUserId}
          existingReservation={existingReservation}
          scenarioLabel={scenarioLabel}
          analysisPulseKey={analysisPulseKey}
          demoScenario={demoScenario}
          timeline={timeline}
        />
      </div>
    </>
  );
}
