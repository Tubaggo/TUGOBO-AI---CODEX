import { TugoboReservationBrain } from "../ai/brain/reservation-brain";
import { createConversationEngineService } from "../conversation-engine/service";
import { createMockConversationEngineRepositories } from "./conversation-inbox";

export function getMockConversationEngine() {
  const repositories = createMockConversationEngineRepositories();

  return {
    service: createConversationEngineService(repositories),
    brain: new TugoboReservationBrain(),
    tenantId: repositories.tenantId,
    defaultConversationId: repositories.defaultConversationId,
  };
}
