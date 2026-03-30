import type {
  Channel,
  Conversation,
  ConversationListItem,
  ConversationThread,
  InternalNote,
  Lead,
  Message,
  Reservation,
  User,
} from "../domain/types";
import type {
  ConversationListFilter,
  ConversationRepository,
  CreateConversationInput,
  CreateInternalNoteInput,
  CreateLeadInput,
  CreateMessageInput,
  LeadRepository,
  MessageRepository,
  UpdateLeadInput,
  UpdateConversationInput,
} from "../services/contracts";

export const tenantId = "tenant_blue_cove";

export const users: User[] = [
  {
    id: "user_manager",
    fullName: "Selin Kaya",
    email: "selin@bluecovehotel.com",
    phone: "+90 533 111 0002",
    passwordHash: null,
    avatarUrl: null,
    roleType: "manager",
    isActive: true,
    lastLoginAt: "2026-03-13T08:20:00.000Z",
    createdAt: "2026-01-01T10:00:00.000Z",
    updatedAt: "2026-03-13T08:20:00.000Z",
  },
  {
    id: "user_staff",
    fullName: "Mert Demir",
    email: "mert@bluecovehotel.com",
    phone: "+90 533 111 0003",
    passwordHash: null,
    avatarUrl: null,
    roleType: "reservation_staff",
    isActive: true,
    lastLoginAt: "2026-03-13T09:00:00.000Z",
    createdAt: "2026-01-01T10:05:00.000Z",
    updatedAt: "2026-03-13T09:00:00.000Z",
  },
  {
    id: "user_owner",
    fullName: "Deniz Arslan",
    email: "deniz@bluecovehotel.com",
    phone: "+90 533 111 0001",
    passwordHash: null,
    avatarUrl: null,
    roleType: "owner",
    isActive: true,
    lastLoginAt: "2026-03-13T07:45:00.000Z",
    createdAt: "2026-01-01T09:55:00.000Z",
    updatedAt: "2026-03-13T07:45:00.000Z",
  },
];

export const channels: Channel[] = [
  {
    id: "channel_whatsapp",
    tenantId,
    type: "whatsapp",
    displayName: "Blue Cove WhatsApp",
    status: "connected",
    externalAccountId: "wa_blue_cove_001",
    webhookUrl: null,
    metadata: { phoneNumber: "+90 252 111 2233" },
    connectedAt: "2026-01-05T09:00:00.000Z",
    createdAt: "2026-01-05T09:00:00.000Z",
    updatedAt: "2026-01-05T09:00:00.000Z",
  },
  {
    id: "channel_instagram",
    tenantId,
    type: "instagram",
    displayName: "Blue Cove Instagram",
    status: "connected",
    externalAccountId: "ig_blue_cove_001",
    webhookUrl: null,
    metadata: { handle: "@bluecovehotel" },
    connectedAt: "2026-01-05T09:10:00.000Z",
    createdAt: "2026-01-05T09:10:00.000Z",
    updatedAt: "2026-01-05T09:10:00.000Z",
  },
  {
    id: "channel_webchat",
    tenantId,
    type: "webchat",
    displayName: "Blue Cove Webchat",
    status: "connected",
    externalAccountId: "web_blue_cove_001",
    webhookUrl: null,
    metadata: { widgetId: "widget_blue_cove" },
    connectedAt: "2026-01-06T08:00:00.000Z",
    createdAt: "2026-01-06T08:00:00.000Z",
    updatedAt: "2026-01-06T08:00:00.000Z",
  },
];

const fallbackChannel: Channel = {
  id: "channel_fallback_webchat",
  tenantId,
  type: "webchat",
  displayName: "Fallback Web Chat",
  status: "connected",
  externalAccountId: null,
  webhookUrl: null,
  metadata: null,
  connectedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const conversations: Conversation[] = [
  {
    id: "conv_anna",
    tenantId,
    channelId: "channel_whatsapp",
    leadId: "lead_anna",
    assignedUserId: "user_staff",
    guestName: "Anna Muller",
    guestPhone: "+49 151 234 5678",
    guestEmail: "anna.muller@example.com",
    guestLanguage: "en",
    status: "open",
    source: "whatsapp",
    intent: "reservation_request",
    aiEnabled: true,
    humanHandoff: false,
    tags: ["Standard Booking", "Sea View"],
    firstMessageAt: "2026-03-12T08:05:00.000Z",
    lastMessageAt: "2026-03-12T08:10:00.000Z",
    createdAt: "2026-03-12T08:05:00.000Z",
    updatedAt: "2026-03-12T08:10:00.000Z",
  },
  {
    id: "conv_lina",
    tenantId,
    channelId: "channel_instagram",
    leadId: "lead_lina",
    assignedUserId: "user_manager",
    guestName: "Lina Torres",
    guestPhone: null,
    guestEmail: "lina.torres@example.com",
    guestLanguage: "en",
    status: "human_handling",
    source: "instagram",
    intent: "price_request",
    aiEnabled: false,
    humanHandoff: true,
    tags: ["Group Booking"],
    firstMessageAt: "2026-03-11T14:20:00.000Z",
    lastMessageAt: "2026-03-11T14:38:00.000Z",
    createdAt: "2026-03-11T14:20:00.000Z",
    updatedAt: "2026-03-11T14:38:00.000Z",
  },
  {
    id: "conv_ahmet",
    tenantId,
    channelId: "channel_webchat",
    leadId: "lead_ahmet",
    assignedUserId: "user_staff",
    guestName: "Ahmet Kaya",
    guestPhone: "+90 555 778 8899",
    guestEmail: null,
    guestLanguage: "tr",
    status: "resolved",
    source: "webchat",
    intent: "reservation_request",
    aiEnabled: true,
    humanHandoff: false,
    tags: ["Weekend Stay"],
    firstMessageAt: "2026-03-10T19:00:00.000Z",
    lastMessageAt: "2026-03-10T19:14:00.000Z",
    createdAt: "2026-03-10T19:00:00.000Z",
    updatedAt: "2026-03-10T19:14:00.000Z",
  },
  {
    id: "conv_julia",
    tenantId,
    channelId: "channel_whatsapp",
    leadId: "lead_julia",
    assignedUserId: "user_manager",
    guestName: "Julia Novak",
    guestPhone: "+420 777 888 999",
    guestEmail: "julia.novak@example.com",
    guestLanguage: "en",
    status: "waiting",
    source: "whatsapp",
    intent: "reservation_request",
    aiEnabled: true,
    humanHandoff: false,
    tags: ["Family Stay", "Children"],
    firstMessageAt: "2026-03-13T09:10:00.000Z",
    lastMessageAt: "2026-03-13T09:18:00.000Z",
    createdAt: "2026-03-13T09:10:00.000Z",
    updatedAt: "2026-03-13T09:18:00.000Z",
  },
  {
    id: "conv_omar",
    tenantId,
    channelId: "channel_instagram",
    leadId: "lead_omar",
    assignedUserId: "user_owner",
    guestName: "Omar Rahman",
    guestPhone: null,
    guestEmail: "omar.rahman@example.com",
    guestLanguage: "en",
    status: "open",
    source: "instagram",
    intent: "availability_check",
    aiEnabled: true,
    humanHandoff: false,
    tags: ["High Demand", "Alternative Offer"],
    firstMessageAt: "2026-03-08T12:00:00.000Z",
    lastMessageAt: "2026-03-08T12:25:00.000Z",
    createdAt: "2026-03-08T12:00:00.000Z",
    updatedAt: "2026-03-08T12:25:00.000Z",
  },
];

export const leads: Lead[] = [
  {
    id: "lead_anna",
    tenantId,
    conversationId: "conv_anna",
    assignedUserId: "user_staff",
    fullName: "Anna Muller",
    email: "anna.muller@example.com",
    phone: "+49 151 234 5678",
    language: "en",
    checkIn: "2026-07-21T00:00:00.000Z",
    checkOut: "2026-07-24T00:00:00.000Z",
    guestCount: 2,
    childCount: 0,
    roomTypePreference: "Deluxe Sea View Room",
    budget: 750,
    estimatedValue: 660,
    currency: "EUR",
    sourceChannel: "whatsapp",
    status: "qualified",
    priority: "high",
    temperature: "hot",
    tags: ["Standard Booking", "Sea View"],
    lastActivityAt: "2026-03-12T08:10:00.000Z",
    createdAt: "2026-03-12T08:10:00.000Z",
    updatedAt: "2026-03-12T08:10:00.000Z",
  },
  {
    id: "lead_lina",
    tenantId,
    conversationId: "conv_lina",
    assignedUserId: "user_manager",
    fullName: "Lina Torres",
    email: "lina.torres@example.com",
    phone: null,
    language: "en",
    checkIn: "2026-08-03T00:00:00.000Z",
    checkOut: "2026-08-07T00:00:00.000Z",
    guestCount: 5,
    childCount: 1,
    roomTypePreference: "Family Villa",
    budget: 1800,
    estimatedValue: 1800,
    currency: "EUR",
    sourceChannel: "instagram",
    status: "offer_sent",
    priority: "high",
    temperature: "hot",
    tags: ["Group Booking"],
    lastActivityAt: "2026-03-11T14:38:00.000Z",
    createdAt: "2026-03-11T14:38:00.000Z",
    updatedAt: "2026-03-11T14:38:00.000Z",
  },
  {
    id: "lead_ahmet",
    tenantId,
    conversationId: "conv_ahmet",
    assignedUserId: "user_staff",
    fullName: "Ahmet Kaya",
    email: null,
    phone: "+90 555 778 8899",
    language: "tr",
    checkIn: "2026-04-18T00:00:00.000Z",
    checkOut: "2026-04-20T00:00:00.000Z",
    guestCount: 2,
    childCount: 0,
    roomTypePreference: "Riverfront Bungalow",
    budget: null,
    estimatedValue: 320,
    currency: "EUR",
    sourceChannel: "webchat",
    status: "won",
    priority: "medium",
    temperature: "warm",
    tags: ["Weekend Stay"],
    lastActivityAt: "2026-03-10T19:14:00.000Z",
    createdAt: "2026-03-10T19:14:00.000Z",
    updatedAt: "2026-03-10T19:14:00.000Z",
  },
  {
    id: "lead_julia",
    tenantId,
    conversationId: "conv_julia",
    assignedUserId: "user_manager",
    fullName: "Julia Novak",
    email: "julia.novak@example.com",
    phone: "+420 777 888 999",
    language: "en",
    checkIn: "2026-08-10T00:00:00.000Z",
    checkOut: "2026-08-14T00:00:00.000Z",
    guestCount: 2,
    childCount: 2,
    roomTypePreference: "Family Villa",
    budget: 2200,
    estimatedValue: 1800,
    currency: "EUR",
    sourceChannel: "whatsapp",
    status: "qualified",
    priority: "high",
    temperature: "hot",
    tags: ["Family Stay", "Children"],
    lastActivityAt: "2026-03-13T09:18:00.000Z",
    createdAt: "2026-03-13T09:18:00.000Z",
    updatedAt: "2026-03-13T09:18:00.000Z",
  },
  {
    id: "lead_omar",
    tenantId,
    conversationId: "conv_omar",
    assignedUserId: "user_owner",
    fullName: "Omar Rahman",
    email: "omar.rahman@example.com",
    phone: null,
    language: "en",
    checkIn: "2026-07-16T00:00:00.000Z",
    checkOut: "2026-07-19T00:00:00.000Z",
    guestCount: 2,
    childCount: 0,
    roomTypePreference: "Deluxe Sea View Room",
    budget: 1200,
    estimatedValue: 885,
    currency: "EUR",
    sourceChannel: "instagram",
    status: "qualified",
    priority: "high",
    temperature: "hot",
    tags: ["High Demand", "Alternative Offer"],
    lastActivityAt: "2026-03-08T12:25:00.000Z",
    createdAt: "2026-03-08T12:25:00.000Z",
    updatedAt: "2026-03-08T12:25:00.000Z",
  },
];

export const messages: Message[] = [
  {
    id: "msg_anna_1",
    conversationId: "conv_anna",
    senderType: "guest",
    senderUserId: null,
    messageType: "text",
    content: "Hi, we would like to stay from July 21 to July 24 for two adults.",
    rawPayload: null,
    createdAt: "2026-03-12T08:05:00.000Z",
  },
  {
    id: "msg_anna_2",
    conversationId: "conv_anna",
    senderType: "assistant",
    senderUserId: null,
    messageType: "text",
    content: "Great choice, those dates are beautiful here. Let me check our loveliest sea view rooms for you.",
    rawPayload: null,
    createdAt: "2026-03-12T08:06:00.000Z",
  },
  {
    id: "msg_anna_3",
    conversationId: "conv_anna",
    senderType: "guest",
    senderUserId: null,
    messageType: "text",
    content: "A sea view room with balcony would be perfect. Our budget is around 750 EUR.",
    rawPayload: null,
    createdAt: "2026-03-12T08:10:00.000Z",
  },
  {
    id: "msg_lina_1",
    conversationId: "conv_lina",
    senderType: "guest",
    senderUserId: null,
    messageType: "text",
    content: "Hello, we are 5 adults and 1 child. What is the price for a villa in August?",
    rawPayload: null,
    createdAt: "2026-03-11T14:20:00.000Z",
  },
  {
    id: "msg_lina_2",
    conversationId: "conv_lina",
    senderType: "human",
    senderUserId: "user_manager",
    messageType: "text",
    content: "I have prepared an offer for a 4-night stay and will send the breakdown shortly.",
    rawPayload: null,
    createdAt: "2026-03-11T14:38:00.000Z",
  },
  {
    id: "msg_ahmet_1",
    conversationId: "conv_ahmet",
    senderType: "guest",
    senderUserId: null,
    messageType: "text",
    content: "Merhaba, 18 Nisan giris 20 Nisan cikis 2 kisi icin bungalow uygun mu?",
    rawPayload: null,
    createdAt: "2026-03-10T19:00:00.000Z",
  },
  {
    id: "msg_ahmet_2",
    conversationId: "conv_ahmet",
    senderType: "assistant",
    senderUserId: null,
    messageType: "text",
    content: "Merhaba, bu tarihler icin bungalow cok guzel duruyor. Konaklamanizi hazirlayabilmem icin telefon numaranizi da paylasir misiniz?",
    rawPayload: null,
    createdAt: "2026-03-10T19:03:00.000Z",
  },
  {
    id: "msg_julia_1",
    conversationId: "conv_julia",
    senderType: "guest",
    senderUserId: null,
    messageType: "text",
    content: "Hi, we are 2 adults and 2 children looking for a family villa from August 10 to August 14.",
    rawPayload: null,
    createdAt: "2026-03-13T09:10:00.000Z",
  },
  {
    id: "msg_julia_2",
    conversationId: "conv_julia",
    senderType: "assistant",
    senderUserId: null,
    messageType: "text",
    content: "That sounds like a lovely family stay. Our Family Villa would give everyone more space and comfort, and I can prepare the details for you.",
    rawPayload: null,
    createdAt: "2026-03-13T09:18:00.000Z",
  },
  {
    id: "msg_omar_1",
    conversationId: "conv_omar",
    senderType: "guest",
    senderUserId: null,
    messageType: "text",
    content: "Do you have a Deluxe Sea View Room from July 16 to July 19 for two adults?",
    rawPayload: null,
    createdAt: "2026-03-08T12:00:00.000Z",
  },
  {
    id: "msg_omar_2",
    conversationId: "conv_omar",
    senderType: "assistant",
    senderUserId: null,
    messageType: "text",
    content: "Those dates are very popular and our sea view rooms are going quickly. I do have a beautiful Family Villa available though, with more space and a very comfortable setup. Would you like me to hold it for you?",
    rawPayload: null,
    createdAt: "2026-03-08T12:25:00.000Z",
  },
];

export const notes: InternalNote[] = [
  {
    id: "note_lina_1",
    tenantId,
    conversationId: "conv_lina",
    leadId: "lead_lina",
    authorUserId: "user_manager",
    content: "Group booking. Offer should include breakfast and private transfer upsell.",
    createdAt: "2026-03-11T14:42:00.000Z",
    updatedAt: "2026-03-11T14:42:00.000Z",
  },
  {
    id: "note_julia_1",
    tenantId,
    conversationId: "conv_julia",
    leadId: "lead_julia",
    authorUserId: "user_manager",
    content: "Follow up with family package pricing and airport transfer add-on.",
    createdAt: "2026-03-13T09:22:00.000Z",
    updatedAt: "2026-03-13T09:22:00.000Z",
  },
];

export const reservations: Reservation[] = [
  {
    id: "res_lina",
    tenantId,
    leadId: "lead_lina",
    propertyId: "property_blue_cove_villa",
    roomTypeId: "room_family_villa",
    reservationCode: "BCV-2026-0811",
    guestName: "Lina Torres",
    guestEmail: "lina.torres@example.com",
    guestPhone: null,
    checkIn: "2026-08-03T00:00:00.000Z",
    checkOut: "2026-08-07T00:00:00.000Z",
    adultCount: 5,
    childCount: 1,
    totalPrice: 1800,
    currency: "EUR",
    status: "pending",
    notes: "Guest requested airport transfer pricing.",
    createdAt: "2026-03-11T15:00:00.000Z",
    updatedAt: "2026-03-11T15:00:00.000Z",
  },
  {
    id: "res_ahmet",
    tenantId,
    leadId: "lead_ahmet",
    propertyId: "property_blue_cove_river",
    roomTypeId: "room_riverfront",
    reservationCode: "BCW-2026-0442",
    guestName: "Ahmet Kaya",
    guestEmail: null,
    guestPhone: "+90 555 778 8899",
    checkIn: "2026-04-18T00:00:00.000Z",
    checkOut: "2026-04-20T00:00:00.000Z",
    adultCount: 2,
    childCount: 0,
    totalPrice: 320,
    currency: "EUR",
    status: "confirmed",
    notes: "Deposit received.",
    createdAt: "2026-03-10T19:20:00.000Z",
    updatedAt: "2026-03-10T19:20:00.000Z",
  },
];

function getConversationListItems(): ConversationListItem[] {
  return conversations
    .slice()
    .sort((left, right) => (right.lastMessageAt ?? "").localeCompare(left.lastMessageAt ?? ""))
    .map((conversation) => ({
      conversation,
      channel: channels.find((channel) => channel.id === conversation.channelId) ?? fallbackChannel,
      assignedUser: users.find((user) => user.id === conversation.assignedUserId) ?? null,
      lead: leads.find((lead) => lead.conversationId === conversation.id) ?? null,
      lastMessagePreview:
        messages
          .filter((message) => message.conversationId === conversation.id)
          .slice()
          .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]?.content ?? null,
      unreadCount: conversation.status === "open" ? 1 : 0,
    }));
}

export class MockConversationRepository implements ConversationRepository {
  async findById(requestTenantId: string, conversationId: string) {
    return (
      conversations.find(
        (conversation) => conversation.id === conversationId && conversation.tenantId === requestTenantId,
      ) ?? null
    );
  }

  async list(requestTenantId: string, filter?: ConversationListFilter) {
    return getConversationListItems()
      .filter((item) => item.conversation.tenantId === requestTenantId)
      .filter((item) => (filter?.status ? item.conversation.status === filter.status : true))
      .filter((item) =>
        typeof filter?.assignedUserId === "undefined"
          ? true
          : item.conversation.assignedUserId === filter.assignedUserId,
      )
      .filter((item) => (filter?.channelId ? item.conversation.channelId === filter.channelId : true))
      .filter((item) => (filter?.source ? item.conversation.source === filter.source : true))
      .slice(0, filter?.limit ?? undefined);
  }

  async create(requestTenantId: string, input: CreateConversationInput & { now: Date }) {
    const conversation: Conversation = {
      id: `conv_${conversations.length + 1}`,
      tenantId: requestTenantId,
      channelId: input.channelId,
      leadId: null,
      assignedUserId: input.assignedUserId ?? null,
      guestName: input.guestName ?? null,
      guestPhone: input.guestPhone ?? null,
      guestEmail: input.guestEmail ?? null,
      guestLanguage: input.guestLanguage ?? null,
      status: "open",
      source: input.source,
      intent: input.intent ?? null,
      aiEnabled: input.aiEnabled ?? true,
      humanHandoff: input.humanHandoff ?? false,
      tags: input.tags ?? [],
      firstMessageAt: null,
      lastMessageAt: null,
      createdAt: input.now.toISOString(),
      updatedAt: input.now.toISOString(),
    };
    conversations.push(conversation);
    return conversation;
  }

  async update(requestTenantId: string, conversationId: string, input: UpdateConversationInput & { now: Date }) {
    const index = conversations.findIndex(
      (conversation) => conversation.id === conversationId && conversation.tenantId === requestTenantId,
    );
    if (index === -1) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    conversations[index] = {
      ...conversations[index],
      ...input,
      updatedAt: input.now.toISOString(),
    };
    return conversations[index];
  }

  async addInternalNote(
    requestTenantId: string,
    input: CreateInternalNoteInput & { authorUserId: string; now: Date },
  ) {
    const note: InternalNote = {
      id: `note_${notes.length + 1}`,
      tenantId: requestTenantId,
      conversationId: input.conversationId ?? null,
      leadId: input.leadId ?? null,
      authorUserId: input.authorUserId,
      content: input.content,
      createdAt: input.now.toISOString(),
      updatedAt: input.now.toISOString(),
    };
    notes.push(note);
    return note;
  }

  async getThread(requestTenantId: string, conversationId: string): Promise<ConversationThread | null> {
    const conversation = conversations.find(
      (item) => item.id === conversationId && item.tenantId === requestTenantId,
    );

    if (!conversation) {
      return null;
    }

    return {
      conversation,
      messages: messages
        .filter((message) => message.conversationId === conversationId)
        .sort((left, right) => left.createdAt.localeCompare(right.createdAt)),
      internalNotes: notes
        .filter((note) => note.conversationId === conversationId)
        .sort((left, right) => left.createdAt.localeCompare(right.createdAt)),
      lead: leads.find((lead) => lead.conversationId === conversationId) ?? null,
    };
  }
}

export class MockMessageRepository implements MessageRepository {
  async create(requestTenantId: string, input: CreateMessageInput & { now: Date }) {
    const conversation = conversations.find(
      (item) => item.id === input.conversationId && item.tenantId === requestTenantId,
    );
    if (!conversation) {
      throw new Error(`Conversation not found: ${input.conversationId}`);
    }

    const message: Message = {
      id: `msg_${messages.length + 1}`,
      conversationId: input.conversationId,
      senderType: input.senderType,
      senderUserId: input.senderUserId ?? null,
      messageType: input.messageType ?? "text",
      content: input.content,
      rawPayload: (input.rawPayload as Message["rawPayload"]) ?? null,
      createdAt: input.now.toISOString(),
    };

    messages.push(message);
    conversation.lastMessageAt = input.now.toISOString();
    conversation.firstMessageAt ??= input.now.toISOString();
    conversation.updatedAt = input.now.toISOString();

    return message;
  }

  async listByConversation(requestTenantId: string, conversationId: string) {
    const belongs = conversations.some(
      (conversation) => conversation.id === conversationId && conversation.tenantId === requestTenantId,
    );

    return belongs ? messages.filter((message) => message.conversationId === conversationId) : [];
  }
}

export class MockLeadRepository implements LeadRepository {
  async findById(requestTenantId: string, leadId: string) {
    return leads.find((lead) => lead.id === leadId && lead.tenantId === requestTenantId) ?? null;
  }

  async findByConversationId(requestTenantId: string, conversationId: string) {
    return (
      leads.find(
        (lead) => lead.conversationId === conversationId && lead.tenantId === requestTenantId,
      ) ?? null
    );
  }

  async list(requestTenantId: string, filter?: { status?: Lead["status"]; assignedUserId?: string | null }) {
    return leads
      .filter((lead) => lead.tenantId === requestTenantId)
      .filter((lead) => (filter?.status ? lead.status === filter.status : true))
      .filter((lead) =>
        typeof filter?.assignedUserId === "undefined" ? true : lead.assignedUserId === filter.assignedUserId,
      );
  }

  async create(requestTenantId: string, input: CreateLeadInput & { now: Date }) {
    const lead: Lead = {
      id: `lead_${leads.length + 1}`,
      tenantId: requestTenantId,
      conversationId: input.conversationId ?? null,
      assignedUserId: input.assignedUserId ?? null,
      fullName: input.fullName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      language: input.language ?? null,
      checkIn: input.checkIn ?? null,
      checkOut: input.checkOut ?? null,
      guestCount: input.guestCount ?? null,
      childCount: input.childCount ?? null,
      roomTypePreference: input.roomTypePreference ?? null,
      budget: input.budget ?? null,
      estimatedValue: input.estimatedValue ?? null,
      currency: input.currency ?? "EUR",
      sourceChannel: input.sourceChannel ?? null,
      status: input.status ?? "new",
      priority: input.priority ?? "medium",
      temperature: input.temperature ?? null,
      tags: input.tags ?? [],
      lastActivityAt: input.lastActivityAt ?? input.now.toISOString(),
      createdAt: input.now.toISOString(),
      updatedAt: input.now.toISOString(),
    };
    leads.push(lead);
    return lead;
  }

  async update(requestTenantId: string, leadId: string, input: UpdateLeadInput & { now: Date }) {
    const index = leads.findIndex((lead) => lead.id === leadId && lead.tenantId === requestTenantId);
    if (index === -1) {
      throw new Error(`Lead not found: ${leadId}`);
    }

    leads[index] = {
      ...leads[index],
      conversationId: input.conversationId ?? leads[index].conversationId,
      assignedUserId: input.assignedUserId ?? leads[index].assignedUserId,
      fullName: input.fullName ?? leads[index].fullName,
      email: input.email ?? leads[index].email,
      phone: input.phone ?? leads[index].phone,
      language: input.language ?? leads[index].language,
      checkIn: input.checkIn ?? leads[index].checkIn,
      checkOut: input.checkOut ?? leads[index].checkOut,
      guestCount: input.guestCount ?? leads[index].guestCount,
      childCount: input.childCount ?? leads[index].childCount,
      roomTypePreference: input.roomTypePreference ?? leads[index].roomTypePreference,
      budget: input.budget ?? leads[index].budget,
      estimatedValue: input.estimatedValue ?? leads[index].estimatedValue,
      currency: input.currency ?? leads[index].currency,
      sourceChannel: input.sourceChannel ?? leads[index].sourceChannel,
      status: input.status ?? leads[index].status,
      priority: input.priority ?? leads[index].priority,
      temperature: input.temperature ?? leads[index].temperature,
      tags: input.tags ?? leads[index].tags,
      lastActivityAt: input.lastActivityAt ?? leads[index].lastActivityAt,
      updatedAt: input.now.toISOString(),
    };
    return leads[index];
  }
}

export function createMockConversationEngineRepositories() {
  return {
    conversations: new MockConversationRepository(),
    messages: new MockMessageRepository(),
    leads: new MockLeadRepository(),
    tenantId,
    defaultConversationId: conversations[0]?.id ?? "",
  };
}
