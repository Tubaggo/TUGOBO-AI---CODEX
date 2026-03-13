import { MessageSenderType, MessageType, Prisma } from "@prisma/client";
import type { MessageRepository, CreateMessageInput } from "../../services";
import { prisma } from "../../prisma";
import { mapMessage } from "./mappers";

export class PrismaMessageRepository implements MessageRepository {
  async create(tenantId: string, input: CreateMessageInput & { now: Date }) {
    const message = await prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.findFirst({
        where: { id: input.conversationId, tenantId },
      });

      if (!conversation) {
        throw new Error(`Conversation not found for tenant ${tenantId}: ${input.conversationId}`);
      }

      const created = await tx.message.create({
        data: {
          conversationId: input.conversationId,
          senderType: input.senderType.toUpperCase() as MessageSenderType,
          senderUserId: input.senderUserId,
          messageType: (input.messageType ?? "text").toUpperCase() as MessageType,
          content: input.content,
          rawPayloadJson: input.rawPayload
            ? (input.rawPayload as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          createdAt: input.now,
        },
      });

      await tx.conversation.update({
        where: { id: input.conversationId },
        data: {
          firstMessageAt: conversation.firstMessageAt ?? input.now,
          lastMessageAt: input.now,
          updatedAt: input.now,
        },
      });

      return created;
    });

    return mapMessage(message);
  }

  async listByConversation(tenantId: string, conversationId: string) {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        conversation: { tenantId },
      },
      orderBy: { createdAt: "asc" },
    });

    return messages.map(mapMessage);
  }
}
