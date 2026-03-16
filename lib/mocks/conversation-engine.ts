import { TugoboReservationBrain } from "../ai";
import { createConversationEngineService } from "../conversation-engine";
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
