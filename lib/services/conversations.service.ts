import type { ConversationThread, ReservationExtraction } from "../domain";
import type {
  ConversationLeadSyncResult,
  ConversationRepository,
  CreateConversationInput,
  CreateInternalNoteInput,
  CreateMessageInput,
  LeadRepository,
  ServiceContext,
  UpdateConversationInput,
} from "./contracts";
import { NotFoundError, ValidationError } from "./errors";
import { assertNonEmpty, getNow, normalizeTags } from "./service-helpers";

export class ConversationsService {
  constructor(
    private readonly conversations: ConversationRepository,
    private readonly leads: LeadRepository,
  ) {}

  async list(context: ServiceContext, filter?: Parameters<ConversationRepository["list"]>[1]) {
    return this.conversations.list(context.tenantId, filter);
  }

  async getThread(context: ServiceContext, conversationId: string): Promise<ConversationThread> {
    const thread = await this.conversations.getThread(context.tenantId, conversationId);

    if (!thread) {
      throw new NotFoundError("Conversation", conversationId);
    }

    return thread;
  }

  async create(context: ServiceContext, input: CreateConversationInput) {
    if (!input.channelId) {
      throw new ValidationError("channelId is required.");
    }

    return this.conversations.create(context.tenantId, {
      ...input,
      tags: normalizeTags(input.tags),
      now: getNow(context.now),
    });
  }

  async update(context: ServiceContext, conversationId: string, input: UpdateConversationInput) {
    return this.conversations.update(context.tenantId, conversationId, {
      ...input,
      tags: input.tags ? normalizeTags(input.tags) : undefined,
      now: getNow(context.now),
    });
  }

  async appendMessage(context: ServiceContext, input: CreateMessageInput) {
    assertNonEmpty(input.content, "content");

    return this.conversations.addMessage(context.tenantId, {
      ...input,
      messageType: input.messageType ?? "text",
      now: getNow(context.now),
    });
  }

  async addInternalNote(context: ServiceContext, input: CreateInternalNoteInput) {
    if (!context.actorUserId) {
      throw new ValidationError("actorUserId is required to add an internal note.");
    }

    assertNonEmpty(input.content, "content");

    return this.conversations.addInternalNote(context.tenantId, {
      ...input,
      authorUserId: context.actorUserId,
      now: getNow(context.now),
    });
  }

  async handoffToHuman(context: ServiceContext, conversationId: string) {
    return this.update(context, conversationId, {
      status: "human_handling",
      aiEnabled: false,
      humanHandoff: true,
    });
  }

  async resolve(context: ServiceContext, conversationId: string) {
    return this.update(context, conversationId, {
      status: "resolved",
    });
  }

  async syncLeadFromExtraction(
    context: ServiceContext,
    conversationId: string,
    extracted: Partial<ReservationExtraction>,
  ): Promise<ConversationLeadSyncResult> {
    const thread = await this.getThread(context, conversationId);
    const existingLead = thread.lead ?? (await this.leads.findByConversationId(context.tenantId, conversationId));

    const now = getNow(context.now).toISOString();
    const merged = {
      checkIn: extracted.checkIn ?? existingLead?.checkIn ?? null,
      checkOut: extracted.checkOut ?? existingLead?.checkOut ?? null,
      guestCount: extracted.guestCount ?? existingLead?.guestCount ?? null,
      childCount: extracted.childCount ?? existingLead?.childCount ?? null,
      roomType: extracted.roomType ?? existingLead?.roomTypePreference ?? null,
      budget: extracted.budget ?? existingLead?.budget ?? null,
      name: extracted.name ?? existingLead?.fullName ?? thread.conversation.guestName ?? null,
      email: extracted.email ?? existingLead?.email ?? thread.conversation.guestEmail ?? null,
      phone: extracted.phone ?? existingLead?.phone ?? thread.conversation.guestPhone ?? null,
      language:
        extracted.language ?? existingLead?.language ?? thread.conversation.guestLanguage ?? null,
    };

    const lead = existingLead
      ? await this.leads.update(context.tenantId, existingLead.id, {
          fullName: merged.name,
          email: merged.email,
          phone: merged.phone,
          language: merged.language,
          checkIn: merged.checkIn,
          checkOut: merged.checkOut,
          guestCount: merged.guestCount,
          childCount: merged.childCount,
          roomTypePreference: merged.roomType,
          budget: merged.budget,
          lastActivityAt: now,
          now: getNow(context.now),
        })
      : await this.leads.create(context.tenantId, {
          conversationId,
          fullName: merged.name,
          email: merged.email,
          phone: merged.phone,
          language: merged.language,
          checkIn: merged.checkIn,
          checkOut: merged.checkOut,
          guestCount: merged.guestCount,
          childCount: merged.childCount,
          roomTypePreference: merged.roomType,
          budget: merged.budget,
          sourceChannel: thread.conversation.source,
          status: "new",
          priority: "medium",
          lastActivityAt: now,
          now: getNow(context.now),
        });

    const conversation = await this.update(context, conversationId, {
      guestName: merged.name ?? thread.conversation.guestName,
      guestPhone: merged.phone ?? thread.conversation.guestPhone,
      guestEmail: merged.email ?? thread.conversation.guestEmail,
      guestLanguage: merged.language ?? thread.conversation.guestLanguage,
    });

    return {
      conversation,
      lead,
      extracted: merged,
    };
  }
}
