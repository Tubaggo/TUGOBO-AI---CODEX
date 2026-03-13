import type { Reservation } from "../domain";
import type {
  CreateReservationInput,
  LeadRepository,
  PropertyRepository,
  ReservationRepository,
  ServiceContext,
  UpdateReservationInput,
} from "./contracts";
import { NotFoundError, ValidationError } from "./errors";
import { assertDateRange, getNow } from "./service-helpers";

export class ReservationsService {
  constructor(
    private readonly reservations: ReservationRepository,
    private readonly leads: LeadRepository,
    private readonly properties: PropertyRepository,
  ) {}

  async getById(context: ServiceContext, reservationId: string): Promise<Reservation> {
    const reservation = await this.reservations.findById(context.tenantId, reservationId);

    if (!reservation) {
      throw new NotFoundError("Reservation", reservationId);
    }

    return reservation;
  }

  async create(context: ServiceContext, input: CreateReservationInput) {
    assertDateRange(input.checkIn, input.checkOut);

    if (!(await this.properties.exists(context.tenantId, input.propertyId))) {
      throw new ValidationError(`Property not found: ${input.propertyId}`);
    }

    if (
      input.roomTypeId &&
      !(await this.properties.roomTypeBelongsToProperty(
        context.tenantId,
        input.propertyId,
        input.roomTypeId,
      ))
    ) {
      throw new ValidationError("roomTypeId does not belong to the selected property.");
    }

    if (input.leadId) {
      const lead = await this.leads.findById(context.tenantId, input.leadId);

      if (!lead) {
        throw new ValidationError(`Lead not found: ${input.leadId}`);
      }
    }

    return this.reservations.create(context.tenantId, {
      ...input,
      childCount: input.childCount ?? 0,
      status: input.status ?? "draft",
      now: getNow(context.now),
    });
  }

  async update(context: ServiceContext, reservationId: string, input: UpdateReservationInput) {
    assertDateRange(input.checkIn, input.checkOut);

    return this.reservations.update(context.tenantId, reservationId, {
      ...input,
      now: getNow(context.now),
    });
  }

  async createFromLead(
    context: ServiceContext,
    leadId: string,
    input: Omit<CreateReservationInput, "leadId" | "guestName" | "guestEmail" | "guestPhone">,
  ) {
    const lead = await this.leads.findById(context.tenantId, leadId);

    if (!lead) {
      throw new NotFoundError("Lead", leadId);
    }

    if (!lead.fullName) {
      throw new ValidationError("Lead must have a full name before creating a reservation.");
    }

    return this.create(context, {
      ...input,
      leadId,
      guestName: lead.fullName,
      guestEmail: lead.email,
      guestPhone: lead.phone,
    });
  }

  async confirm(context: ServiceContext, reservationId: string) {
    return this.update(context, reservationId, { status: "confirmed" });
  }

  async cancel(context: ServiceContext, reservationId: string, notes?: string) {
    return this.update(context, reservationId, { status: "canceled", notes });
  }
}
