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
