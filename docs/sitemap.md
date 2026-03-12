# Tugobo AI Sitemap

## 1. Public Marketing Site

- `/`
  - Hero
  - Social proof
  - Core benefits
  - Channel coverage
  - CTA to book demo / start trial
- `/product`
  - Product overview
  - AI reservation assistant
  - Unified inbox
  - Analytics
  - Integrations
- `/solutions`
  - `/solutions/boutique-hotels`
  - `/solutions/resorts`
  - `/solutions/apart-hotels`
  - `/solutions/vacation-rentals`
- `/channels`
  - `/channels/website-chat`
  - `/channels/whatsapp`
  - `/channels/instagram`
  - `/channels/messenger`
- `/integrations`
  - PMS integrations
  - CRM/webhooks
  - Booking engine
- `/pricing`
- `/demo`
- `/about`
- `/contact`
- `/blog`
  - Article detail pages
- `/legal/privacy`
- `/legal/terms`
- `/legal/dpa`

## 2. Authentication

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/invite/accept`
- `/verify-email`

## 3. App Information Architecture

- `/app`
  - Redirect to last active property dashboard

### 3.1 Workspace / Property Scope

- `/app/select-property`
- `/app/:propertyId/overview`

### 3.2 Inbox

- `/app/:propertyId/inbox`
  - All conversations
  - Filters drawer
  - Conversation detail pane
- `/app/:propertyId/inbox/:conversationId`

### 3.3 Leads and Reservations

- `/app/:propertyId/leads`
- `/app/:propertyId/leads/:leadId`
- `/app/:propertyId/reservations`
- `/app/:propertyId/reservations/:reservationId`

### 3.4 Knowledge Base

- `/app/:propertyId/knowledge`
  - Property profile
  - FAQs
  - Policies
  - Promotions
- `/app/:propertyId/knowledge/faqs`
- `/app/:propertyId/knowledge/policies`
- `/app/:propertyId/knowledge/content`

### 3.5 AI Configuration

- `/app/:propertyId/ai`
  - Tone and brand voice
  - Supported languages
  - Escalation rules
  - Prompt settings
  - Fallback behavior
- `/app/:propertyId/ai/testing`
- `/app/:propertyId/ai/logs`

### 3.6 Channels

- `/app/:propertyId/channels`
- `/app/:propertyId/channels/webchat`
- `/app/:propertyId/channels/whatsapp`
- `/app/:propertyId/channels/instagram`
- `/app/:propertyId/channels/messenger`

### 3.7 Inventory and Rates

- `/app/:propertyId/inventory`
- `/app/:propertyId/room-types`
- `/app/:propertyId/rate-plans`
- `/app/:propertyId/availability-rules`

### 3.8 Automation

- `/app/:propertyId/automations`
  - Follow-ups
  - Assignment rules
  - Tagging rules
  - Escalation policies
- `/app/:propertyId/automations/follow-ups`
- `/app/:propertyId/automations/rules`

### 3.9 Analytics

- `/app/:propertyId/analytics`
- `/app/:propertyId/analytics/conversations`
- `/app/:propertyId/analytics/conversion`
- `/app/:propertyId/analytics/revenue`
- `/app/:propertyId/analytics/agents`

### 3.10 Team and Settings

- `/app/:propertyId/team`
- `/app/:propertyId/settings/general`
- `/app/:propertyId/settings/billing`
- `/app/:propertyId/settings/security`
- `/app/:propertyId/settings/integrations`
- `/app/:propertyId/settings/webhooks`

## 4. Navigation Model

### Primary Navigation

- Overview
- Inbox
- Leads
- Reservations
- Knowledge
- AI
- Channels
- Inventory
- Automations
- Analytics
- Team
- Settings

### Secondary Contextual Navigation

- Property switcher
- Date range selector
- Saved filters
- Notification center
- User menu

## 5. Recommended MVP Navigation

For the initial release, prioritize:

- Overview
- Inbox
- Leads
- Knowledge
- AI
- Channels
- Analytics
- Settings
