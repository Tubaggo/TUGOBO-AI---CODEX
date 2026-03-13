import type {
  AssistantConfig,
  Channel,
  Conversation,
  ConversationIntent,
  ConversationListItem,
  ConversationStatus,
  ConversationThread,
  InternalNote,
  Lead,
  LeadPriority,
  LeadStatus,
  Message,
  Reservation,
  ReservationExtraction,
  ReservationStatus,
} from "../domain";

export interface ServiceContext {
  tenantId: string;
  actorUserId?: string | null;
  now?: Date;
}

export interface ConversationListFilter {
  status?: ConversationStatus;
  assignedUserId?: string | null;
  channelId?: string;
  source?: Channel["type"];
  limit?: number;
}

export interface CreateConversationInput {
  channelId: string;
  source: Channel["type"];
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  guestLanguage?: string | null;
  assignedUserId?: string | null;
  intent?: ConversationIntent | null;
  aiEnabled?: boolean;
  humanHandoff?: boolean;
  tags?: string[];
}

export interface UpdateConversationInput {
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  guestLanguage?: string | null;
  assignedUserId?: string | null;
  status?: ConversationStatus;
  intent?: ConversationIntent | null;
  aiEnabled?: boolean;
  humanHandoff?: boolean;
  tags?: string[];
}

export interface CreateMessageInput {
  conversationId: string;
  senderType: Message["senderType"];
  senderUserId?: string | null;
  messageType?: Message["messageType"];
  content: string;
  rawPayload?: Record<string, unknown> | null;
}

export interface CreateInternalNoteInput {
  conversationId?: string | null;
  leadId?: string | null;
  content: string;
}

export interface CreateLeadInput {
  conversationId?: string | null;
  assignedUserId?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  language?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  guestCount?: number | null;
  childCount?: number | null;
  roomTypePreference?: string | null;
  budget?: number | null;
  estimatedValue?: number | null;
  currency?: string | null;
  sourceChannel?: Channel["type"] | null;
  status?: LeadStatus;
  priority?: LeadPriority;
  temperature?: Lead["temperature"];
  tags?: string[];
  lastActivityAt?: string | null;
}

export interface UpdateLeadInput extends CreateLeadInput {
  status?: LeadStatus;
}

export interface CreateReservationInput {
  leadId?: string | null;
  propertyId: string;
  roomTypeId?: string | null;
  reservationCode: string;
  guestName: string;
  guestEmail?: string | null;
  guestPhone?: string | null;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount?: number;
  totalPrice: number;
  currency: string;
  status?: ReservationStatus;
  notes?: string | null;
}

export interface UpdateReservationInput {
  roomTypeId?: string | null;
  guestName?: string;
  guestEmail?: string | null;
  guestPhone?: string | null;
  checkIn?: string;
  checkOut?: string;
  adultCount?: number;
  childCount?: number;
  totalPrice?: number;
  currency?: string;
  status?: ReservationStatus;
  notes?: string | null;
}

export interface UpsertAssistantConfigInput {
  tone: string;
  welcomeMessage?: string | null;
  fallbackMessage?: string | null;
  supportedLanguages?: string[];
  handoffRules?: AssistantConfig["handoffRules"];
  businessHours?: AssistantConfig["businessHours"];
  responseStyle?: AssistantConfig["responseStyle"];
  collectPhone?: boolean;
  collectEmail?: boolean;
  collectDates?: boolean;
}

export interface ConversationRepository {
  findById(tenantId: string, conversationId: string): Promise<Conversation | null>;
  list(tenantId: string, filter?: ConversationListFilter): Promise<ConversationListItem[]>;
  create(tenantId: string, input: CreateConversationInput & { now: Date }): Promise<Conversation>;
  update(
    tenantId: string,
    conversationId: string,
    input: UpdateConversationInput & { now: Date },
  ): Promise<Conversation>;
  addMessage(tenantId: string, input: CreateMessageInput & { now: Date }): Promise<Message>;
  addInternalNote(
    tenantId: string,
    input: CreateInternalNoteInput & { authorUserId: string; now: Date },
  ): Promise<InternalNote>;
  getThread(tenantId: string, conversationId: string): Promise<ConversationThread | null>;
}

export interface LeadRepository {
  findById(tenantId: string, leadId: string): Promise<Lead | null>;
  findByConversationId(tenantId: string, conversationId: string): Promise<Lead | null>;
  list(tenantId: string, filter?: { status?: LeadStatus; assignedUserId?: string | null }): Promise<Lead[]>;
  create(tenantId: string, input: CreateLeadInput & { now: Date }): Promise<Lead>;
  update(tenantId: string, leadId: string, input: UpdateLeadInput & { now: Date }): Promise<Lead>;
}

export interface ReservationRepository {
  findById(tenantId: string, reservationId: string): Promise<Reservation | null>;
  findByLeadId(tenantId: string, leadId: string): Promise<Reservation | null>;
  create(tenantId: string, input: CreateReservationInput & { now: Date }): Promise<Reservation>;
  update(
    tenantId: string,
    reservationId: string,
    input: UpdateReservationInput & { now: Date },
  ): Promise<Reservation>;
}

export interface AssistantConfigRepository {
  getByTenantId(tenantId: string): Promise<AssistantConfig | null>;
  upsert(
    tenantId: string,
    input: UpsertAssistantConfigInput & { now: Date },
  ): Promise<AssistantConfig>;
}

export interface PropertyRepository {
  exists(tenantId: string, propertyId: string): Promise<boolean>;
  roomTypeBelongsToProperty(
    tenantId: string,
    propertyId: string,
    roomTypeId: string,
  ): Promise<boolean>;
}

export interface ConversationLeadSyncResult {
  conversation: Conversation;
  lead: Lead;
  extracted: ReservationExtraction;
}
