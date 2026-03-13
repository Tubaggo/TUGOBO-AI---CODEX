import { ChannelType, ConversationIntent, ConversationStatus } from "@prisma/client";
import type {
  ConversationListFilter,
  ConversationRepository,
  CreateConversationInput,
  CreateInternalNoteInput,
  UpdateConversationInput,
} from "../../services";
import { prisma } from "../../prisma";
import { mapConversation, mapConversationListItem, mapConversationThread } from "./mappers";

function toChannelType(source: CreateConversationInput["source"]) {
  return source.toUpperCase() as ChannelType;
}

function toConversationStatus(status: UpdateConversationInput["status"]) {
  return status ? (status.toUpperCase() as ConversationStatus) : undefined;
}

function toConversationIntent(intent: UpdateConversationInput["intent"]) {
  return intent ? (intent.toUpperCase() as ConversationIntent) : undefined;
}

export class PrismaConversationRepository implements ConversationRepository {
  async findById(tenantId: string, conversationId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, tenantId },
      include: {
        channel: true,
        lead: true,
        assignedUser: true,
        messages: { orderBy: { createdAt: "asc" } },
        internalNotes: { orderBy: { createdAt: "asc" } },
      },
    });

    return conversation ? mapConversation(conversation) : null;
  }

  async list(tenantId: string, filter?: ConversationListFilter) {
    const conversations = await prisma.conversation.findMany({
      where: {
        tenantId,
        status: filter?.status ? (filter.status.toUpperCase() as ConversationStatus) : undefined,
        assignedUserId:
          typeof filter?.assignedUserId === "undefined" ? undefined : filter.assignedUserId,
        channelId: filter?.channelId,
        source: filter?.source ? (filter.source.toUpperCase() as ChannelType) : undefined,
      },
      include: {
        channel: true,
        lead: true,
        assignedUser: true,
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
      take: filter?.limit,
    });

    return conversations.map(mapConversationListItem);
  }

  async create(tenantId: string, input: CreateConversationInput & { now: Date }) {
    const conversation = await prisma.conversation.create({
      data: {
        tenantId,
        channelId: input.channelId,
        source: toChannelType(input.source),
        guestName: input.guestName,
        guestPhone: input.guestPhone,
        guestEmail: input.guestEmail,
        guestLanguage: input.guestLanguage,
        assignedUserId: input.assignedUserId,
        intent: input.intent ? (input.intent.toUpperCase() as ConversationIntent) : undefined,
        aiEnabled: input.aiEnabled ?? true,
        humanHandoff: input.humanHandoff ?? false,
        status: ConversationStatus.OPEN,
        tagsJson: input.tags ?? [],
        createdAt: input.now,
        updatedAt: input.now,
      },
      include: {
        channel: true,
        lead: true,
        assignedUser: true,
        messages: { orderBy: { createdAt: "asc" } },
        internalNotes: { orderBy: { createdAt: "asc" } },
      },
    });

    return mapConversation(conversation);
  }

  async update(tenantId: string, conversationId: string, input: UpdateConversationInput & { now: Date }) {
    const existing = await prisma.conversation.findFirst({
      where: { id: conversationId, tenantId },
    });

    if (!existing) {
      throw new Error(`Conversation not found for tenant ${tenantId}: ${conversationId}`);
    }

    const conversation = await prisma.conversation.update({
      where: { id: existing.id },
      data: {
        guestName: input.guestName,
        guestPhone: input.guestPhone,
        guestEmail: input.guestEmail,
        guestLanguage: input.guestLanguage,
        assignedUserId: input.assignedUserId,
        status: toConversationStatus(input.status),
        intent: toConversationIntent(input.intent),
        aiEnabled: input.aiEnabled,
        humanHandoff: input.humanHandoff,
        tagsJson: input.tags,
        updatedAt: input.now,
      },
      include: {
        channel: true,
        lead: true,
        assignedUser: true,
        messages: { orderBy: { createdAt: "asc" } },
        internalNotes: { orderBy: { createdAt: "asc" } },
      },
    });

    return mapConversation(conversation);
  }

  async addInternalNote(
    tenantId: string,
    input: CreateInternalNoteInput & { authorUserId: string; now: Date },
  ) {
    const note = await prisma.internalNote.create({
      data: {
        tenantId,
        conversationId: input.conversationId,
        leadId: input.leadId,
        authorUserId: input.authorUserId,
        content: input.content,
        createdAt: input.now,
        updatedAt: input.now,
      },
    });

    return {
      id: note.id,
      tenantId: note.tenantId,
      conversationId: note.conversationId,
      leadId: note.leadId,
      authorUserId: note.authorUserId,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    };
  }

  async getThread(tenantId: string, conversationId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, tenantId },
      include: {
        channel: true,
        lead: true,
        assignedUser: true,
        messages: { orderBy: { createdAt: "asc" } },
        internalNotes: { orderBy: { createdAt: "asc" } },
      },
    });

    return conversation ? mapConversationThread(conversation) : null;
  }
}
