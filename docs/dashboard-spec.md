# Tugobo AI Dashboard Specification

## 1. Purpose

The Tugobo AI dashboard is the operational control center for hotel teams. It must let staff monitor AI conversations, take over when needed, configure knowledge and business rules, and measure booking outcomes.

## 2. Design Principles

- Optimize for reservation operations first, not generic customer support.
- Keep the active conversation and lead status visible at all times.
- Make AI decisions inspectable and reversible.
- Support multi-property organizations without confusing single-property users.
- Minimize clicks for common front-desk actions.

## 3. Roles

### Owner / Admin

- Full access to billing, integrations, AI settings, team, analytics

### Manager

- Access to inbox, leads, analytics, knowledge, automations, team

### Agent

- Access to inbox, lead details, manual replies, notes, limited analytics

### Analyst / Read-Only

- Access to dashboards and reports without operational edits

## 4. Global Layout

### Left Sidebar

- Property switcher
- Main navigation
- Expand/collapse behavior

### Top Bar

- Global search
- Date range selector
- Notifications
- Channel health indicators
- User profile menu

### Main Workspace

- Page title
- Context actions
- Page-specific modules

## 5. Overview Page

Path: `/app/:propertyId/overview`

### Primary Widgets

- Inquiry volume today
- Qualified leads today
- Quote-to-booking conversion
- Revenue influenced by AI
- First response time
- Human takeover rate

### Secondary Widgets

- Channel mix
- Top guest intents
- Unresolved conversations
- SLA breaches
- Agent workload

### Actions

- View hot leads
- Open escalations
- Test AI
- Edit knowledge base

## 6. Inbox Page

Path: `/app/:propertyId/inbox`

### Layout

- Left column: conversation list
- Center column: active transcript
- Right column: guest and lead context

### Conversation List

- Status badge
- Guest name or anonymous identifier
- Channel icon
- Last message preview
- Time since last message
- Assignee avatar
- Lead score

### Transcript Panel

- Message bubbles with sender labels
- AI decision markers
- Suggested replies
- Takeover toggle
- Internal notes thread
- Attachments and media

### Context Panel

- Guest details
- Stay details
- Requested room preferences
- Quote history
- Tags
- Linked reservation
- AI confidence and reasoning summary

### Inbox Actions

- Assign conversation
- Change lead status
- Send reply
- Trigger template
- Escalate
- Snooze
- Close conversation

## 7. Lead Detail Page

Path: `/app/:propertyId/leads/:leadId`

### Sections

- Lead summary
- Guest profile
- Timeline of messages and actions
- Quoted options
- Follow-up history
- Outcome status

### Key Fields

- Lead source
- Dates requested
- Occupancy
- Budget range
- Preferred room type
- Contact info
- Last activity
- Owner / assignee

## 8. Reservations Page

Path: `/app/:propertyId/reservations`

### Purpose

Track reservations influenced, created, or synced through Tugobo AI.

### Table Columns

- Reservation ID
- Guest name
- Dates
- Property
- Status
- Room type
- Rate plan
- Channel source
- Revenue
- Sync status

## 9. Knowledge Base Pages

### Property Profile

- About the property
- Amenities
- Location and transport
- Nearby attractions
- House rules

### FAQ Manager

- Question
- Canonical answer
- Category
- Language variants
- Last updated
- Usage frequency

### Policy Manager

- Cancellation policy
- Payment policy
- Child policy
- Pet policy
- Check-in/out policy
- Smoking policy

## 10. AI Configuration Pages

### Tone and Brand

- Brand voice preset
- Formality level
- Allowed phrasing rules
- Restricted claims

### Conversation Rules

- Required slot collection
- Escalation conditions
- Human takeover triggers
- Language routing
- Quiet hours behavior

### Testing Console

- Simulated user messages
- Channel selector
- Prompt version selector
- Response preview
- Decision trace

### AI Logs

- Conversation ID
- Prompt version
- Model response metadata
- Confidence score
- Tool/API calls
- Error state

## 11. Channels Pages

Each channel page should show:

- Connection status
- Account details
- Last sync time
- Allowed message types
- Channel-specific templates
- Failure logs

## 12. Inventory and Rates

### Room Types

- Name
- Max occupancy
- Bedding
- Amenities
- Photos
- Description

### Rate Plans

- Rate name
- Refundability
- Meal inclusion
- Minimum stay
- Pricing source

## 13. Automations

### Follow-Up Builder

- Trigger event
- Delay
- Audience conditions
- Message template
- Stop conditions

### Rule Engine

- If/then rules for assignment, tagging, escalation, and reminders

## 14. Analytics Pages

### Conversation Analytics

- Volume by channel
- Average response time
- Containment rate
- Escalation rate

### Conversion Analytics

- Quotes sent
- Bookings won
- Lost reasons
- Funnel drop-off

### Revenue Analytics

- Revenue by channel
- Revenue by property
- Upsell revenue
- Influenced vs direct confirmed revenue

### Agent Analytics

- Handle time
- Takeover outcome
- Response SLA
- Closed-won contribution

## 15. Notifications and Alerts

- New VIP inquiry
- Escalation waiting beyond SLA
- Integration sync failure
- Channel disconnected
- Knowledge gaps detected from repeated unanswered questions

## 16. Permissions Matrix

| Area | Admin | Manager | Agent | Analyst |
| --- | --- | --- | --- | --- |
| Inbox reply | Yes | Yes | Yes | No |
| AI settings | Yes | Yes | No | No |
| Billing | Yes | No | No | No |
| Knowledge editing | Yes | Yes | Limited | No |
| Analytics | Yes | Yes | Limited | Yes |
| Team management | Yes | Yes | No | No |

## 17. Empty States

- No conversations yet
- No connected channels
- No FAQs configured
- No analytics in selected range
- No room types mapped

Each empty state should explain the next setup action and provide a CTA.
