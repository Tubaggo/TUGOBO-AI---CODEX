import type { Channel, Conversation, Lead, Reservation, User } from "../domain";
import { channels, conversations, leads, reservations, users, tenantId } from "./conversation-inbox";

const leadStatuses = ["new", "qualified", "offer_sent", "won", "lost"] as const;
export type OverviewStatKey =
  | "openConversations"
  | "leadsCaptured"
  | "bookingsWon"
  | "pipelineValue"
  | "humanHandoffs";

export type LeadFilterInput = {
  status?: Lead["status"];
  assignedUserId?: string;
  channel?: Lead["sourceChannel"];
};

export type LeadRecord = {
  lead: Lead;
  conversation: Conversation | null;
  reservation: Reservation | null;
  assignedUser: User | null;
  channel: Channel | null;
};

export function listLeadRecords(filters: LeadFilterInput = {}): LeadRecord[] {
  return leads
    .filter((lead) => lead.tenantId === tenantId)
    .filter((lead) => (filters.status ? lead.status === filters.status : true))
    .filter((lead) => (filters.assignedUserId ? lead.assignedUserId === filters.assignedUserId : true))
    .filter((lead) => (filters.channel ? lead.sourceChannel === filters.channel : true))
    .slice()
    .sort((left, right) => (right.lastActivityAt ?? "").localeCompare(left.lastActivityAt ?? ""))
    .map((lead) => {
      const conversation = conversations.find((item) => item.id === lead.conversationId) ?? null;
      return {
        lead,
        conversation,
        reservation: reservations.find((reservation) => reservation.leadId === lead.id) ?? null,
        assignedUser: users.find((user) => user.id === lead.assignedUserId) ?? null,
        channel: channels.find(
          (channel) => channel.id === conversation?.channelId || channel.type === lead.sourceChannel,
        ) ?? null,
      };
    });
}

export function getLeadRecord(leadId: string): LeadRecord | null {
  return listLeadRecords().find((item) => item.lead.id === leadId) ?? null;
}

export function getLeadFilters() {
  return {
    statuses: leadStatuses,
    assignedUsers: users,
    channels,
  };
}

export function getOverviewAnalytics() {
  const leadRecords = listLeadRecords();
  const openConversations = conversations.filter((conversation) =>
    ["open", "waiting", "human_handling"].includes(conversation.status),
  ).length;
  const wonLeads = leadRecords.filter((item) => item.lead.status === "won").length;
  const handoffs = conversations.filter((conversation) => conversation.humanHandoff).length;
  const totalEstimatedValue = leadRecords.reduce(
    (total, item) => total + (item.lead.estimatedValue ?? 0),
    0,
  );

  return {
    stats: [
      {
        key: "openConversations",
        value: String(openConversations),
      },
      {
        key: "leadsCaptured",
        value: String(leadRecords.length),
      },
      {
        key: "bookingsWon",
        value: String(wonLeads),
      },
      {
        key: "pipelineValue",
        value: `EUR ${totalEstimatedValue.toLocaleString("en-GB")}`,
      },
      {
        key: "humanHandoffs",
        value: String(handoffs),
      },
    ] as Array<{ key: OverviewStatKey; value: string }>,
    channelDistribution: channels.map((channel) => ({
      channel: channel.type,
      count: leadRecords.filter((item) => item.lead.sourceChannel === channel.type).length,
    })),
    statusDistribution: leadStatuses.map((status) => ({
      status,
      count: leadRecords.filter((item) => item.lead.status === status).length,
    })),
    recentLeads: leadRecords.slice(0, 4),
    recentConversations: conversations
      .slice()
      .sort((left, right) => (right.lastMessageAt ?? "").localeCompare(left.lastMessageAt ?? ""))
      .slice(0, 4)
      .map((conversation) => ({
        conversation,
        lead: leadRecords.find((item) => item.lead.conversationId === conversation.id)?.lead ?? null,
      })),
  };
}
