import { extractLeadDataFromMessage } from "./lead-extraction.helper";
import { resolveConversationState } from "./conversation-state.manager";
import { ConversationsService } from "../services/conversations.service";
import type { ConversationRepository, LeadRepository, MessageRepository } from "../services/contracts";

export function createConversationEngineService(input: {
  conversations: ConversationRepository;
  messages: MessageRepository;
  leads: LeadRepository;
}) {
  return new ConversationsService(
    input.conversations,
    input.messages,
    input.leads,
    extractLeadDataFromMessage,
    resolveConversationState,
  );
}
