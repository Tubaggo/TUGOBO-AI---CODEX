import type {
  AssistantConfig,
  Channel,
  Conversation,
  ConversationListItem,
  ConversationThread,
  InternalNote,
  JsonValue,
  Lead,
  Message,
  User,
} from "../../domain";
import type { Prisma } from "@prisma/client";

type PrismaConversation = Prisma.ConversationGetPayload<{
  include: {
    channel: true;
    lead: true;
    assignedUser: true;
    messages: true;
    internalNotes: true;
  };
}>;

type PrismaConversationList = Prisma.ConversationGetPayload<{
  include: {
    channel: true;
    lead: true;
    assignedUser: true;
    messages: { orderBy: { createdAt: "desc" }; take: 1 };
  };
}>;

export function mapUser(user: {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  passwordHash: string | null;
  avatarUrl: string | null;
  roleType: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    passwordHash: user.passwordHash,
    avatarUrl: user.avatarUrl,
    roleType: user.roleType.toLowerCase() as User["roleType"],
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function mapChannel(channel: {
  id: string;
  tenantId: string;
  type: string;
  displayName: string;
  status: string;
  externalAccountId: string | null;
  webhookUrl: string | null;
  metadataJson: Prisma.JsonValue | null;
  connectedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): Channel {
  return {
    id: channel.id,
    tenantId: channel.tenantId,
    type: channel.type.toLowerCase() as Channel["type"],
    displayName: channel.displayName,
    status: channel.status.toLowerCase() as Channel["status"],
    externalAccountId: channel.externalAccountId,
    webhookUrl: channel.webhookUrl,
    metadata: (channel.metadataJson as Record<string, JsonValue> | null) ?? null,
    connectedAt: channel.connectedAt?.toISOString() ?? null,
    createdAt: channel.createdAt.toISOString(),
    updatedAt: channel.updatedAt.toISOString(),
  };
}

export function mapLead(lead: {
  id: string;
  tenantId: string;
  conversationId: string | null;
  assignedUserId: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  language: string | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guestCount: number | null;
  childCount: number | null;
  roomTypePreference: string | null;
  budget: Prisma.Decimal | null;
  estimatedValue: Prisma.Decimal | null;
  currency: string | null;
  sourceChannel: string | null;
  status: string;
  priority: string;
  temperature: string | null;
  tagsJson: Prisma.JsonValue | null;
  lastActivityAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): Lead {
  return {
    id: lead.id,
    tenantId: lead.tenantId,
    conversationId: lead.conversationId,
    assignedUserId: lead.assignedUserId,
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    language: lead.language,
    checkIn: lead.checkIn?.toISOString() ?? null,
    checkOut: lead.checkOut?.toISOString() ?? null,
    guestCount: lead.guestCount,
    childCount: lead.childCount,
    roomTypePreference: lead.roomTypePreference,
    budget: lead.budget ? Number(lead.budget) : null,
    estimatedValue: lead.estimatedValue ? Number(lead.estimatedValue) : null,
    currency: lead.currency,
    sourceChannel: (lead.sourceChannel?.toLowerCase() as Lead["sourceChannel"]) ?? null,
    status: lead.status.toLowerCase() as Lead["status"],
    priority: lead.priority.toLowerCase() as Lead["priority"],
    temperature: (lead.temperature?.toLowerCase() as Lead["temperature"]) ?? null,
    tags: (lead.tagsJson as string[] | null) ?? [],
    lastActivityAt: lead.lastActivityAt?.toISOString() ?? null,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}

export function mapMessage(message: {
  id: string;
  conversationId: string;
  senderType: string;
  senderUserId: string | null;
  messageType: string;
  content: string;
  rawPayloadJson: Prisma.JsonValue | null;
  createdAt: Date;
}): Message {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderType: message.senderType.toLowerCase() as Message["senderType"],
    senderUserId: message.senderUserId,
    messageType: message.messageType.toLowerCase() as Message["messageType"],
    content: message.content,
    rawPayload: (message.rawPayloadJson as Record<string, JsonValue> | null) ?? null,
    createdAt: message.createdAt.toISOString(),
  };
}

export function mapInternalNote(note: {
  id: string;
  tenantId: string;
  conversationId: string | null;
  leadId: string | null;
  authorUserId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}): InternalNote {
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

export function mapConversation(conversation: PrismaConversation): Conversation {
  return {
    id: conversation.id,
    tenantId: conversation.tenantId,
    channelId: conversation.channelId,
    leadId: conversation.lead?.id ?? null,
    assignedUserId: conversation.assignedUserId,
    guestName: conversation.guestName,
    guestPhone: conversation.guestPhone,
    guestEmail: conversation.guestEmail,
    guestLanguage: conversation.guestLanguage,
    status: conversation.status.toLowerCase() as Conversation["status"],
    source: conversation.source.toLowerCase() as Conversation["source"],
    intent: (conversation.intent?.toLowerCase() as Conversation["intent"]) ?? null,
    aiEnabled: conversation.aiEnabled,
    humanHandoff: conversation.humanHandoff,
    tags: (conversation.tagsJson as string[] | null) ?? [],
    firstMessageAt: conversation.firstMessageAt?.toISOString() ?? null,
    lastMessageAt: conversation.lastMessageAt?.toISOString() ?? null,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  };
}

export function mapConversationListItem(item: PrismaConversationList): ConversationListItem {
  return {
    conversation: {
      id: item.id,
      tenantId: item.tenantId,
      channelId: item.channelId,
      leadId: item.lead?.id ?? null,
      assignedUserId: item.assignedUserId,
      guestName: item.guestName,
      guestPhone: item.guestPhone,
      guestEmail: item.guestEmail,
      guestLanguage: item.guestLanguage,
      status: item.status.toLowerCase() as Conversation["status"],
      source: item.source.toLowerCase() as Conversation["source"],
      intent: (item.intent?.toLowerCase() as Conversation["intent"]) ?? null,
      aiEnabled: item.aiEnabled,
      humanHandoff: item.humanHandoff,
      tags: (item.tagsJson as string[] | null) ?? [],
      firstMessageAt: item.firstMessageAt?.toISOString() ?? null,
      lastMessageAt: item.lastMessageAt?.toISOString() ?? null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    },
    channel: mapChannel(item.channel),
    assignedUser: item.assignedUser ? mapUser(item.assignedUser) : null,
    lead: item.lead ? mapLead(item.lead) : null,
    lastMessagePreview: item.messages[0]?.content ?? null,
    unreadCount: 0,
  };
}

export function mapConversationThread(conversation: PrismaConversation): ConversationThread {
  return {
    conversation: mapConversation(conversation),
    messages: conversation.messages.map(mapMessage),
    internalNotes: conversation.internalNotes.map(mapInternalNote),
    lead: conversation.lead ? mapLead(conversation.lead) : null,
  };
}
