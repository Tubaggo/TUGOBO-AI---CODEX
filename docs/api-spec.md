# Tugobo AI API Specification

## 1. API Overview

The Tugobo AI API supports property management, conversation handling, lead management, knowledge-base administration, analytics retrieval, and integration callbacks.

Base URL:

```text
https://api.tugobo.ai/v1
```

Format:

- JSON request/response
- UTF-8 encoded
- ISO 8601 timestamps

## 2. Authentication

Use bearer-token authentication.

```http
Authorization: Bearer <token>
```

### Auth Model

- Workspace-scoped users authenticate via dashboard auth
- Server-to-server integrations use API keys or OAuth where relevant
- Webhooks use signing secrets

## 3. Core Resources

- Workspaces
- Properties
- Conversations
- Messages
- Leads
- Reservations
- Knowledge articles
- FAQs
- Policies
- Channels
- Automations
- Analytics
- Webhooks

## 4. Conventions

### Pagination

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "total": 420
  }
}
```

### Error Format

```json
{
  "error": {
    "code": "validation_error",
    "message": "check_in is required",
    "details": {
      "field": "check_in"
    }
  }
}
```

## 5. Properties API

### `GET /properties`

List properties accessible to the authenticated user.

### `POST /properties`

Create a new property.

Example request:

```json
{
  "name": "Blue Coast Hotel",
  "timezone": "Europe/Istanbul",
  "currency": "EUR",
  "defaultLanguage": "en"
}
```

### `GET /properties/{propertyId}`

Get property details.

### `PATCH /properties/{propertyId}`

Update property settings.

## 6. Conversations API

### Conversation Object

```json
{
  "id": "conv_123",
  "propertyId": "prop_123",
  "channel": "whatsapp",
  "status": "active",
  "language": "en",
  "guest": {
    "name": "Jane Doe",
    "phone": "+905551112233"
  },
  "leadId": "lead_123",
  "assignedTo": "user_456",
  "lastMessageAt": "2026-03-12T10:15:00Z",
  "createdAt": "2026-03-12T09:50:00Z"
}
```

### `GET /conversations`

Query conversations by property, status, channel, assignee, date range, and text search.

Query params:

- `propertyId`
- `status`
- `channel`
- `assignedTo`
- `q`
- `from`
- `to`

### `POST /conversations`

Create a conversation record from an inbound channel event.

### `GET /conversations/{conversationId}`

Retrieve conversation detail with latest lead context.

### `PATCH /conversations/{conversationId}`

Update status, assignee, tags, or handoff mode.

Example request:

```json
{
  "status": "escalated",
  "assignedTo": "user_456",
  "mode": "manual"
}
```

## 7. Messages API

### `GET /conversations/{conversationId}/messages`

List message history.

### `POST /conversations/{conversationId}/messages`

Send an outbound message.

Example request:

```json
{
  "sender": "agent",
  "type": "text",
  "content": "We have availability for your requested dates. Would you like the Standard or Deluxe option?"
}
```

### `POST /conversations/{conversationId}/ai-reply`

Generate an AI reply using current conversation context and configured prompts.

Example response:

```json
{
  "reply": {
    "content": "We have two options for those dates. Would you like me to share the details?",
    "language": "en",
    "confidence": 0.91
  },
  "actions": [
    {
      "type": "collect_slot",
      "slot": "email"
    }
  ]
}
```

## 8. Leads API

### Lead Object

```json
{
  "id": "lead_123",
  "propertyId": "prop_123",
  "status": "quoted",
  "sourceChannel": "webchat",
  "guest": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "stayRequest": {
    "checkIn": "2026-05-14",
    "checkOut": "2026-05-16",
    "adults": 2,
    "children": 0
  },
  "score": 82
}
```

### `GET /leads`

List leads with filtering by status, owner, source, and date range.

### `POST /leads`

Create a lead manually or from an external integration.

### `GET /leads/{leadId}`

Get lead details.

### `PATCH /leads/{leadId}`

Update lead status, notes, assignee, and structured stay data.

## 9. Reservations API

### `GET /reservations`

List reservations influenced or created by Tugobo AI.

### `POST /reservations`

Create a draft or confirmed reservation.

### `GET /reservations/{reservationId}`

Get reservation details.

### `PATCH /reservations/{reservationId}`

Update reservation status or sync metadata.

## 10. Knowledge Base API

### `GET /faqs`

List FAQs for a property.

### `POST /faqs`

Create an FAQ entry.

Example request:

```json
{
  "propertyId": "prop_123",
  "question": "Is breakfast included?",
  "answer": "Breakfast is included in selected rate plans and served from 7:00 to 10:30.",
  "category": "dining",
  "language": "en"
}
```

### `PATCH /faqs/{faqId}`

Update FAQ content.

### `GET /policies`

List policies by property.

### `POST /policies`

Create or replace a policy document.

## 11. Channels API

### `GET /channels`

List configured channels and health status.

### `POST /channels/{channelType}/connect`

Create or finalize a channel connection.

### `PATCH /channels/{channelId}`

Update channel settings, templates, or routing rules.

## 12. Automation API

### `GET /automations`

List automation rules.

### `POST /automations`

Create a follow-up or rule-based automation.

Example request:

```json
{
  "propertyId": "prop_123",
  "type": "follow_up",
  "trigger": "quote_sent",
  "delayMinutes": 180,
  "templateId": "tmpl_123",
  "stopConditions": ["reservation_confirmed", "guest_opt_out"]
}
```

## 13. Analytics API

### `GET /analytics/overview`

Return core KPIs for the selected property and date range.

Query params:

- `propertyId`
- `from`
- `to`

Example response:

```json
{
  "inquiries": 1480,
  "qualifiedLeads": 520,
  "quotesSent": 341,
  "bookingsWon": 74,
  "influencedRevenue": 28640,
  "avgFirstResponseSeconds": 11,
  "takeoverRate": 0.18
}
```

### `GET /analytics/conversations`

Return conversation metrics by channel, language, and outcome.

### `GET /analytics/conversion`

Return funnel and drop-off metrics.

### `GET /analytics/revenue`

Return revenue attribution metrics.

## 14. Webhooks

### Supported Events

- `conversation.created`
- `conversation.escalated`
- `message.received`
- `lead.created`
- `lead.updated`
- `reservation.created`
- `reservation.confirmed`
- `channel.disconnected`

### Webhook Payload Example

```json
{
  "id": "evt_123",
  "type": "lead.updated",
  "createdAt": "2026-03-12T10:30:00Z",
  "data": {
    "leadId": "lead_123",
    "propertyId": "prop_123",
    "status": "quoted"
  }
}
```

## 15. Rate Limits

- Default: 120 requests per minute per token
- Burst: 300 requests per minute for internal service accounts
- Webhook retries use exponential backoff

## 16. Security Requirements

- TLS-only transport
- Signed webhooks
- Role-based authorization checks on every resource
- Audit logging for write operations
- Token rotation support

## 17. Suggested Internal Service Boundaries

- Auth service
- Property configuration service
- Conversation orchestration service
- AI gateway service
- Knowledge service
- Lead/reservation service
- Analytics pipeline
- Integration adapter service
