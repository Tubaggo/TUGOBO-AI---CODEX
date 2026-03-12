# Tugobo AI Product Requirements Document

## 1. Product Overview

Tugobo AI is a SaaS AI reservation assistant built for hotels and accommodation businesses. It automates guest-facing reservation conversations across website chat, WhatsApp, Instagram, Facebook Messenger, and other messaging channels while synchronizing with hotel operations, pricing, availability, and lead management workflows.

The product is positioned as a conversion and operations layer between guests and the property. Its core job is to answer fast, qualify demand, collect booking details, present room options, trigger reservation actions, and hand off to staff when confidence is low or a guest requires human support.

## 2. Problem Statement

Accommodation businesses lose bookings because:

- Response times are slow outside working hours.
- Front-desk teams repeat the same availability and pricing answers.
- Lead information from chat channels is fragmented and hard to follow up.
- Staff cannot consistently answer in multiple languages.
- OTA dependency increases when direct-booking channels underperform.
- Manual handling creates errors in rates, guest details, and follow-up.

## 3. Product Vision

Enable hotels to capture and convert direct booking demand 24/7 with an AI assistant that behaves like a trained reservations agent, integrates with hotel systems, and gives staff full control over pricing logic, escalation, and reporting.

## 4. Goals

### Business Goals

- Increase direct booking conversions.
- Reduce response time to under 10 seconds on supported channels.
- Reduce repetitive reservation workload for staff.
- Improve multilingual coverage without hiring additional agents.
- Centralize guest inquiry and reservation intent data.

### User Goals

- Guests can ask natural-language questions and receive accurate answers immediately.
- Guests can complete an inquiry or booking flow without switching channels.
- Hotel staff can see every conversation, intervene, and manage unresolved leads.
- Managers can monitor conversion, team performance, and AI quality.

## 5. Non-Goals

- Replacing the PMS as the system of record for finalized reservations.
- Acting as a full revenue-management system.
- Serving restaurants, airlines, or non-accommodation verticals in V1.
- Offering consumer-facing marketplace discovery.

## 6. Target Users

### Primary Users

- Boutique hotels
- City hotels
- Resorts
- Apart hotels
- Vacation rental operators with managed inventory
- Hostels with structured room/bed inventory

### Product Personas

#### Hotel Owner / General Manager

Needs direct revenue growth, operational visibility, and minimal setup friction.

#### Reservation Manager

Needs reliable automation, escalation control, pricing governance, and clear lead status.

#### Front Desk / Reservation Agent

Needs a shared inbox, guest context, and quick takeover when the AI cannot resolve a request.

#### Guest

Needs fast, clear answers about availability, pricing, policies, amenities, transfers, and booking steps.

## 7. Core Value Proposition

Tugobo AI turns every hotel inquiry channel into an always-on reservation desk that can:

- Answer questions in multiple languages
- Capture stay dates, occupancy, and preferences
- Quote rooms and rates using business rules and integrations
- Follow up with undecided guests
- Escalate to staff with full context
- Provide managers with performance analytics

## 8. Key Use Cases

- Direct booking inquiry from website chat
- WhatsApp reservation conversation
- Room availability and rate quote
- FAQ handling for policies and amenities
- Upsell suggestions such as breakfast, airport transfer, spa, late checkout
- Human handoff for special requests or negotiation
- Lead recapture when a guest does not complete a booking
- Post-conversation summary for staff follow-up

## 9. Feature Requirements

### 9.1 Channel Inbox

- Unified conversation inbox for all connected channels
- Filter by property, status, channel, language, assignee, and lead score
- Real-time conversation updates
- Conversation transcript with AI and agent events
- Internal notes and tagging

### 9.2 AI Reservation Assistant

- Multilingual guest messaging
- Intent detection: availability, pricing, policies, amenities, transfer, cancellation, group inquiry, complaint, handoff
- Slot collection: check-in, check-out, adults, children, room count, nationality, budget, contact details
- Context retention within a conversation
- Safety and brand tone controls
- Confidence scoring with fallback rules

### 9.3 Room and Rate Presentation

- Structured room type catalog
- Occupancy, bedding, amenity, and policy display
- Rate plan support: refundable, non-refundable, breakfast included, promo
- Dynamic quote generation from configured rules or external availability APIs
- Rate validity window and disclaimers

### 9.4 Lead and Reservation Pipeline

- Inquiry statuses: new, qualified, quoted, awaiting guest, escalated, won, lost, spam
- Lead scoring based on intent, completeness, channel, and engagement
- Guest profile linking across conversations
- Manual or automated follow-up tasks
- Reservation conversion attribution

### 9.5 Human Handoff

- Auto-escalation when confidence is low or policy disallows autonomous handling
- Staff takeover and return-to-AI controls
- SLA timers for escalated conversations
- AI-generated conversation summary for agents

### 9.6 Knowledge Base and Property Content

- Property profile: description, amenities, location, nearby attractions
- Policies: cancellation, child policy, pet policy, check-in/out, payment terms
- FAQ authoring with versioning
- Seasonal campaigns and promotions

### 9.7 Integrations

- PMS / CRS integration for reservation sync
- Channel adapters: web widget, WhatsApp, Instagram, Messenger
- CRM/webhook export for leads
- Email/SMS notification hooks
- Analytics and ad attribution integrations

### 9.8 Dashboard and Analytics

- Inquiry volume by channel and property
- Response time and takeover rate
- Quote-to-booking conversion
- Top intents and unresolved topics
- Agent workload and SLA adherence
- Revenue influenced by AI conversations

## 10. Functional Requirements

### Guest Conversation Requirements

- The system must respond in the guest language where supported.
- The system must identify whether the guest intent is informational, transactional, or service-related.
- The system must collect only the minimum required fields to continue the reservation flow.
- The system must ask clarifying questions when dates, occupancy, or room requirements are missing.
- The system must not confirm unavailable inventory as bookable.

### Staff Operations Requirements

- Staff must be able to override AI messages before sending when in manual mode.
- Staff must be able to configure escalation rules by intent, language, VIP status, and confidence threshold.
- Staff must be able to search all conversations by guest name, phone, email, booking reference, or keyword.

### Admin Requirements

- Admins must manage one or more properties under one account.
- Admins must define brand tone, supported languages, and response policies.
- Admins must configure room types, rate-plan mapping, and channel settings.

## 11. Non-Functional Requirements

- Multi-tenant architecture with strict tenant isolation
- Target response latency under 3 seconds for FAQ replies and under 8 seconds for quoted replies, excluding external system delays
- 99.9% monthly uptime target
- Audit logs for admin changes, agent actions, and AI decisions
- GDPR-aware data retention and deletion workflows
- Role-based access control
- Secure storage of channel tokens and integration credentials

## 12. Success Metrics

### North-Star Metric

Direct booking conversions influenced or completed by Tugobo AI.

### Supporting Metrics

- First response time
- AI containment rate
- Human takeover rate
- Quote completion rate
- Booking conversion rate
- Revenue per qualified lead
- Guest satisfaction score after conversation
- Accuracy rate for FAQ and policy responses

## 13. Risks

- Inaccurate availability or pricing from weak integrations
- Hallucinated policy responses if the knowledge base is incomplete
- Over-automation harming premium guest experience
- Messaging-platform policy changes affecting channel coverage
- Staff distrust if AI actions are not explainable

## 14. Assumptions

- Hotels can provide accurate room, policy, and pricing information.
- Many properties will begin with semi-automated quoting before full PMS integration.
- WhatsApp and website chat will be the highest-priority channels in early adoption.
- Final booking confirmation may occur inside Tugobo AI or via linked booking engine depending on integration maturity.

## 15. Milestones

### Phase 1

- Property setup
- Web chat widget
- Unified inbox
- FAQ assistant
- Basic qualification flow
- Manual quote support

### Phase 2

- WhatsApp integration
- Structured room/rate quoting
- Human handoff rules
- Analytics dashboard
- Follow-up automation

### Phase 3

- PMS/CRS synchronization
- Multi-property accounts
- Revenue attribution
- Campaign and upsell automation
- Advanced reporting and QA review
