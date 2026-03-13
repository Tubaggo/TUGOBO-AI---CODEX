import type { Lead, ReservationExtraction } from "../domain";
import type {
  CreateLeadInput,
  LeadRepository,
  ServiceContext,
  UpdateLeadInput,
} from "./contracts";
import { NotFoundError } from "./errors";
import { assertDateRange, getNow, normalizeTags } from "./service-helpers";

export class LeadsService {
  constructor(private readonly leads: LeadRepository) {}

  async list(context: ServiceContext, filter?: Parameters<LeadRepository["list"]>[1]) {
    return this.leads.list(context.tenantId, filter);
  }

  async getById(context: ServiceContext, leadId: string): Promise<Lead> {
    const lead = await this.leads.findById(context.tenantId, leadId);

    if (!lead) {
      throw new NotFoundError("Lead", leadId);
    }

    return lead;
  }

  async create(context: ServiceContext, input: CreateLeadInput) {
    assertDateRange(input.checkIn, input.checkOut);

    return this.leads.create(context.tenantId, {
      ...input,
      tags: normalizeTags(input.tags),
      status: input.status ?? "new",
      priority: input.priority ?? "medium",
      now: getNow(context.now),
    });
  }

  async update(context: ServiceContext, leadId: string, input: UpdateLeadInput) {
    assertDateRange(input.checkIn, input.checkOut);

    return this.leads.update(context.tenantId, leadId, {
      ...input,
      tags: input.tags ? normalizeTags(input.tags) : undefined,
      now: getNow(context.now),
    });
  }

  async qualify(
    context: ServiceContext,
    leadId: string,
    input: { status: Lead["status"]; priority?: Lead["priority"]; estimatedValue?: number | null },
  ) {
    return this.update(context, leadId, {
      status: input.status,
      priority: input.priority,
      estimatedValue: input.estimatedValue,
      lastActivityAt: getNow(context.now).toISOString(),
    });
  }

  async applyExtraction(
    context: ServiceContext,
    leadId: string,
    extraction: Partial<ReservationExtraction>,
  ) {
    return this.update(context, leadId, {
      fullName: extraction.name,
      email: extraction.email,
      phone: extraction.phone,
      language: extraction.language,
      checkIn: extraction.checkIn,
      checkOut: extraction.checkOut,
      guestCount: extraction.guestCount,
      childCount: extraction.childCount,
      roomTypePreference: extraction.roomType,
      budget: extraction.budget,
      lastActivityAt: getNow(context.now).toISOString(),
    });
  }
}
