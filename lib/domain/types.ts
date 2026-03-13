export type ISODateString = string;
export type CurrencyCode = string;
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export type BusinessType =
  | "hotel"
  | "boutique_hotel"
  | "apart_hotel"
  | "pension"
  | "bungalow"
  | "glamping"
  | "villa"
  | "small_resort"
  | "other";

export type PlatformRoleType = "super_admin" | "owner" | "manager" | "reservation_staff";
export type MembershipRole = "owner" | "manager" | "reservation_staff";
export type PlanCode = "starter" | "growth" | "pro";
export type BillingCycle = "monthly" | "yearly";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "expired";
export type UsageMetricType =
  | "conversations_count"
  | "ai_messages_count"
  | "leads_count"
  | "reservations_count"
  | "team_members_count"
  | "channels_count";

export type PropertyType =
  | "hotel"
  | "boutique_hotel"
  | "apart_hotel"
  | "pension"
  | "bungalow"
  | "glamping"
  | "villa"
  | "other";

export type ChannelType = "whatsapp" | "instagram" | "webchat";
export type ChannelStatus = "connected" | "disconnected" | "pending" | "error";
export type ConversationStatus =
  | "open"
  | "waiting"
  | "resolved"
  | "archived"
  | "human_handling";
export type ConversationIntent =
  | "reservation_request"
  | "availability_check"
  | "price_request"
  | "property_info"
  | "cancellation_change"
  | "cancellation_request"
  | "human_handoff"
  | "other";
export type MessageSenderType = "guest" | "assistant" | "human" | "system";
export type MessageType = "text" | "note" | "system" | "attachment_placeholder";
export type LeadStatus = "new" | "qualified" | "offer_sent" | "won" | "lost";
export type LeadPriority = "low" | "medium" | "high";
export type LeadTemperature = "hot" | "warm" | "cold";
export type ReservationStatus = "draft" | "pending" | "confirmed" | "canceled" | "completed";
export type KnowledgeBaseCategory =
  | "faq"
  | "policy"
  | "room_info"
  | "amenities"
  | "location"
  | "checkin_checkout"
  | "pricing_info"
  | "general";
export type ResponseStyle = "concise" | "balanced" | "detailed";
export type AutomationFlowType =
  | "reservation_intake"
  | "missing_information"
  | "pricing"
  | "human_handoff"
  | "follow_up";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  businessType: BusinessType;
  phone: string | null;
  email: string | null;
  website: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  timezone: string | null;
  currency: CurrencyCode;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  passwordHash: string | null;
  avatarUrl: string | null;
  roleType: PlatformRoleType;
  isActive: boolean;
  lastLoginAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Membership {
  id: string;
  tenantId: string;
  userId: string;
  role: MembershipRole;
  createdAt: ISODateString;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planName: string;
  planCode: PlanCode;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  startedAt: ISODateString;
  endsAt: ISODateString | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UsageMetric {
  id: string;
  tenantId: string;
  metricType: UsageMetricType;
  value: number;
  periodStart: ISODateString;
  periodEnd: ISODateString;
  createdAt: ISODateString;
}

export interface Property {
  id: string;
  tenantId: string;
  name: string;
  propertyType: PropertyType;
  description: string | null;
  city: string | null;
  country: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  amenities: JsonValue[] | null;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface RoomType {
  id: string;
  propertyId: string;
  name: string;
  code: string;
  description: string | null;
  capacityAdults: number;
  capacityChildren: number;
  basePrice: number;
  currency: CurrencyCode;
  amenities: JsonValue[] | null;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PricingRule {
  id: string;
  propertyId: string;
  roomTypeId: string | null;
  name: string;
  seasonName: string | null;
  startDate: ISODateString;
  endDate: ISODateString;
  minNights: number | null;
  pricePerNight: number;
  currency: CurrencyCode;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Channel {
  id: string;
  tenantId: string;
  type: ChannelType;
  displayName: string;
  status: ChannelStatus;
  externalAccountId: string | null;
  webhookUrl: string | null;
  metadata: Record<string, JsonValue> | null;
  connectedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Conversation {
  id: string;
  tenantId: string;
  channelId: string;
  leadId: string | null;
  assignedUserId: string | null;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  guestLanguage: string | null;
  status: ConversationStatus;
  source: ChannelType;
  intent: ConversationIntent | null;
  aiEnabled: boolean;
  humanHandoff: boolean;
  tags: string[];
  firstMessageAt: ISODateString | null;
  lastMessageAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: MessageSenderType;
  senderUserId: string | null;
  messageType: MessageType;
  content: string;
  rawPayload: Record<string, JsonValue> | null;
  createdAt: ISODateString;
}

export interface InternalNote {
  id: string;
  tenantId: string;
  conversationId: string | null;
  leadId: string | null;
  authorUserId: string;
  content: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Lead {
  id: string;
  tenantId: string;
  conversationId: string | null;
  assignedUserId: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  language: string | null;
  checkIn: ISODateString | null;
  checkOut: ISODateString | null;
  guestCount: number | null;
  childCount: number | null;
  roomTypePreference: string | null;
  budget: number | null;
  estimatedValue: number | null;
  currency: CurrencyCode | null;
  sourceChannel: ChannelType | null;
  status: LeadStatus;
  priority: LeadPriority;
  temperature: LeadTemperature | null;
  tags: string[];
  lastActivityAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Reservation {
  id: string;
  tenantId: string;
  leadId: string | null;
  propertyId: string;
  roomTypeId: string | null;
  reservationCode: string;
  guestName: string;
  guestEmail: string | null;
  guestPhone: string | null;
  checkIn: ISODateString;
  checkOut: ISODateString;
  adultCount: number;
  childCount: number;
  totalPrice: number;
  currency: CurrencyCode;
  status: ReservationStatus;
  notes: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface KnowledgeBaseEntry {
  id: string;
  tenantId: string;
  propertyId: string | null;
  category: KnowledgeBaseCategory;
  title: string;
  content: string;
  language: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface AssistantConfig {
  id: string;
  tenantId: string;
  tone: string;
  welcomeMessage: string | null;
  fallbackMessage: string | null;
  supportedLanguages: string[];
  handoffRules: AssistantHandoffRules | null;
  businessHours: BusinessHoursConfig | null;
  responseStyle: ResponseStyle;
  collectPhone: boolean;
  collectEmail: boolean;
  collectDates: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface AutomationFlow {
  id: string;
  tenantId: string;
  name: string;
  flowType: AutomationFlowType;
  description: string | null;
  config: Record<string, JsonValue> | null;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  metadata: Record<string, JsonValue> | null;
  createdAt: ISODateString;
}

export interface ReservationExtraction {
  checkIn: ISODateString | null;
  checkOut: ISODateString | null;
  guestCount: number | null;
  childCount: number | null;
  roomType: string | null;
  budget: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  language: string | null;
}

export interface ConversationMetrics {
  firstResponseMinutes: number | null;
  resolutionMinutes: number | null;
  humanHandoffRate: number | null;
  leadConversionRate: number | null;
}

export interface AssistantHandoffRules {
  humanRequestKeywords: string[];
  lowConfidenceThreshold: number;
  groupBookingMinGuests: number;
  enableComplaintEscalation: boolean;
}

export interface BusinessHoursConfig {
  timezone: string;
  weekdays: Array<{
    day: number;
    start: string;
    end: string;
    enabled: boolean;
  }>;
}

export interface ConversationListItem {
  conversation: Conversation;
  channel: Channel;
  assignedUser: User | null;
  lead: Lead | null;
  lastMessagePreview: string | null;
  unreadCount: number;
}

export interface ConversationThread {
  conversation: Conversation;
  messages: Message[];
  internalNotes: InternalNote[];
  lead: Lead | null;
}
