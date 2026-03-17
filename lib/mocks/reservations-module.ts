import type { Conversation, Lead, Reservation, User } from "../domain";
import { conversations, leads, reservations, users } from "./conversation-inbox";

export type ReservationRecord = {
  reservation: Reservation;
  lead: Lead | null;
  conversation: Conversation | null;
  assignedUser: User | null;
  lastActivityAt: string | null;
  createdFromLead: boolean;
};

export function listReservationRecords(filter?: { status?: Reservation["status"] }): ReservationRecord[] {
  return reservations
    .filter((reservation) => (filter?.status ? reservation.status === filter.status : true))
    .slice()
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .map((reservation) => {
      const lead = leads.find((item) => item.id === reservation.leadId) ?? null;
      const conversation = lead
        ? conversations.find((item) => item.id === lead.conversationId) ?? null
        : null;
      const assignedUser = lead ? users.find((user) => user.id === lead.assignedUserId) ?? null : null;

      return {
        reservation,
        lead,
        conversation,
        assignedUser,
        lastActivityAt: reservation.updatedAt ?? lead?.lastActivityAt ?? conversation?.lastMessageAt ?? null,
        createdFromLead: Boolean(lead),
      };
    });
}

export function getReservationRecord(reservationId: string): ReservationRecord | null {
  return listReservationRecords().find((item) => item.reservation.id === reservationId) ?? null;
}

export function getReservationByLeadId(leadId: string): ReservationRecord | null {
  return listReservationRecords().find((item) => item.reservation.leadId === leadId) ?? null;
}

export function getReservableLeads() {
  return leads
    .filter((lead) => !reservations.some((reservation) => reservation.leadId === lead.id))
    .filter((lead) => lead.fullName && lead.checkIn && lead.checkOut)
    .map((lead) => ({
      lead,
      conversation: conversations.find((item) => item.id === lead.conversationId) ?? null,
      assignedUser: users.find((user) => user.id === lead.assignedUserId) ?? null,
    }));
}

export function createDraftReservationFromLead(leadId: string): ReservationRecord | null {
  const lead = leads.find((item) => item.id === leadId);

  if (!lead || !lead.fullName || !lead.checkIn || !lead.checkOut) {
    return null;
  }

  const conversation = conversations.find((item) => item.id === lead.conversationId) ?? null;
  const assignedUser = users.find((user) => user.id === lead.assignedUserId) ?? null;

  return {
    reservation: {
      id: `draft_${lead.id}`,
      tenantId: lead.tenantId,
      leadId: lead.id,
      propertyId: "property_blue_cove_main",
      roomTypeId: null,
      reservationCode: `DRAFT-${lead.id.toUpperCase()}`,
      guestName: lead.fullName,
      guestEmail: lead.email,
      guestPhone: lead.phone,
      checkIn: lead.checkIn,
      checkOut: lead.checkOut,
      adultCount: lead.guestCount ?? 2,
      childCount: lead.childCount ?? 0,
      totalPrice: lead.estimatedValue ?? 0,
      currency: lead.currency ?? "EUR",
      status: "pending",
      notes: "Draft created from linked lead in the CRM reservation module.",
      createdAt: lead.updatedAt,
      updatedAt: lead.updatedAt,
    },
    lead,
    conversation,
    assignedUser,
    lastActivityAt: lead.lastActivityAt,
    createdFromLead: true,
  };
}

type CreateReservationFromDraftInput = {
  tenantId: string;
  actorUserId: string;
  leadId: string;
  conversationId: string | null;
  candidateRoomType: string | null;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  estimatedTotalPrice: number;
  currency: string;
  notes: string;
};

export async function createReservationFromDraftSuggestion(
  input: CreateReservationFromDraftInput,
): Promise<{
  reservationId: string;
  message: string;
  summary: {
    reservationId: string;
    guestName: string;
    room: string | null;
    checkIn: string;
    checkOut: string;
    estimatedPrice: number;
    currency: string;
    status: Reservation["status"];
  };
}> {
  const existing = getReservationByLeadId(input.leadId);

  if (existing) {
    return {
      reservationId: existing.reservation.id,
      message: "✅ Reservation successfully created",
      summary: {
        reservationId: existing.reservation.id,
        guestName: existing.reservation.guestName,
        room: input.candidateRoomType,
        checkIn: existing.reservation.checkIn,
        checkOut: existing.reservation.checkOut,
        estimatedPrice: existing.reservation.totalPrice,
        currency: existing.reservation.currency,
        status: existing.reservation.status,
      },
    };
  }

  const lead = leads.find((item) => item.id === input.leadId && item.tenantId === input.tenantId);

  if (!lead) {
    throw new Error(`Lead not found: ${input.leadId}`);
  }

  const timestamp = new Date().toISOString();
  const reservation: Reservation = {
    id: `res_${reservations.length + 1}`,
    tenantId: input.tenantId,
    leadId: lead.id,
    propertyId: "property_blue_cove_main",
    roomTypeId: null,
    reservationCode: `TUG-${String(reservations.length + 1).padStart(4, "0")}`,
    guestName: lead.fullName ?? "Guest",
    guestEmail: lead.email,
    guestPhone: lead.phone,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adultCount: input.adultCount,
    childCount: input.childCount,
    totalPrice: input.estimatedTotalPrice,
    currency: input.currency,
    status: "pending",
    notes: `${input.notes}${input.candidateRoomType ? ` Room: ${input.candidateRoomType}.` : ""}`,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  reservations.unshift(reservation);
  lead.status = "won";
  lead.estimatedValue = input.estimatedTotalPrice;
  lead.updatedAt = timestamp;
  lead.lastActivityAt = timestamp;

  return {
    reservationId: reservation.id,
    message: "✅ Reservation successfully created",
    summary: {
      reservationId: reservation.id,
      guestName: reservation.guestName,
      room: input.candidateRoomType,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      estimatedPrice: reservation.totalPrice,
      currency: reservation.currency,
      status: reservation.status,
    },
  };
}
