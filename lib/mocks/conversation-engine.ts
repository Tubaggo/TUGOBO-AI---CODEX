import { createConversationEngineService } from "../conversation-engine";
import { createMockConversationEngineRepositories } from "./conversation-inbox";

export function getMockConversationEngine() {
  const repositories = createMockConversationEngineRepositories();

  return {
    service: createConversationEngineService(repositories),
    tenantId: repositories.tenantId,
    defaultConversationId: repositories.defaultConversationId,
  };
}
