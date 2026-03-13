import { ChannelType, LeadPriority, LeadStatus, LeadTemperature } from "@prisma/client";
import type { CreateLeadInput, LeadRepository, UpdateLeadInput } from "../../services";
import { prisma } from "../../prisma";
import { mapLead } from "./mappers";

export class PrismaLeadRepository implements LeadRepository {
  async findById(tenantId: string, leadId: string) {
    const lead = await prisma.lead.findFirst({ where: { id: leadId, tenantId } });
    return lead ? mapLead(lead) : null;
  }

  async findByConversationId(tenantId: string, conversationId: string) {
    const lead = await prisma.lead.findFirst({ where: { tenantId, conversationId } });
    return lead ? mapLead(lead) : null;
  }

  async list(
    tenantId: string,
    filter?: { status?: "new" | "qualified" | "offer_sent" | "won" | "lost"; assignedUserId?: string | null },
  ) {
    const leads = await prisma.lead.findMany({
      where: {
        tenantId,
        status: filter?.status ? (filter.status.toUpperCase() as LeadStatus) : undefined,
        assignedUserId:
          typeof filter?.assignedUserId === "undefined" ? undefined : filter.assignedUserId,
      },
      orderBy: [{ lastActivityAt: "desc" }, { createdAt: "desc" }],
    });

    return leads.map(mapLead);
  }

  async create(tenantId: string, input: CreateLeadInput & { now: Date }) {
    const lead = await prisma.lead.create({
      data: {
        tenantId,
        conversationId: input.conversationId,
        assignedUserId: input.assignedUserId,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        language: input.language,
        checkIn: input.checkIn ? new Date(input.checkIn) : null,
        checkOut: input.checkOut ? new Date(input.checkOut) : null,
        guestCount: input.guestCount,
        childCount: input.childCount,
        roomTypePreference: input.roomTypePreference,
        budget: typeof input.budget === "number" ? input.budget : null,
        estimatedValue: typeof input.estimatedValue === "number" ? input.estimatedValue : null,
        currency: input.currency,
        sourceChannel: input.sourceChannel ? (input.sourceChannel.toUpperCase() as ChannelType) : null,
        status: (input.status ?? "new").toUpperCase() as LeadStatus,
        priority: (input.priority ?? "medium").toUpperCase() as LeadPriority,
        temperature: input.temperature ? (input.temperature.toUpperCase() as LeadTemperature) : null,
        tagsJson: input.tags ?? [],
        lastActivityAt: input.lastActivityAt ? new Date(input.lastActivityAt) : null,
        createdAt: input.now,
        updatedAt: input.now,
      },
    });

    return mapLead(lead);
  }

  async update(tenantId: string, leadId: string, input: UpdateLeadInput & { now: Date }) {
    const existing = await prisma.lead.findFirst({
      where: { id: leadId, tenantId },
    });

    if (!existing) {
      throw new Error(`Lead not found for tenant ${tenantId}: ${leadId}`);
    }

    const lead = await prisma.lead.update({
      where: { id: existing.id },
      data: {
        conversationId: input.conversationId,
        assignedUserId: input.assignedUserId,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        language: input.language,
        checkIn: input.checkIn ? new Date(input.checkIn) : undefined,
        checkOut: input.checkOut ? new Date(input.checkOut) : undefined,
        guestCount: input.guestCount,
        childCount: input.childCount,
        roomTypePreference: input.roomTypePreference,
        budget: typeof input.budget === "number" ? input.budget : undefined,
        estimatedValue: typeof input.estimatedValue === "number" ? input.estimatedValue : undefined,
        currency: input.currency,
        sourceChannel: input.sourceChannel ? (input.sourceChannel.toUpperCase() as ChannelType) : undefined,
        status: input.status ? (input.status.toUpperCase() as LeadStatus) : undefined,
        priority: input.priority ? (input.priority.toUpperCase() as LeadPriority) : undefined,
        temperature: input.temperature
          ? (input.temperature.toUpperCase() as LeadTemperature)
          : undefined,
        tagsJson: input.tags,
        lastActivityAt: input.lastActivityAt ? new Date(input.lastActivityAt) : undefined,
        updatedAt: input.now,
      },
    });

    return mapLead(lead);
  }
}
