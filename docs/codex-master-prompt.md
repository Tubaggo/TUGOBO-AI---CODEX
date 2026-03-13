# Tugobo AI CRM - Codex Master Prompt

## Project Overview

You are building a production-oriented SaaS CRM platform called **Tugobo AI**.

Tugobo AI is an **AI-powered reservation assistant and CRM system designed for tourism accommodation businesses**, including:

- Hotels
- Boutique hotels
- Apart hotels
- Pensions
- Bungalow businesses
- Glamping facilities
- Small resorts

The system centralizes reservation inquiries from multiple communication channels and helps businesses convert more conversations into bookings.

This product is **NOT just a chatbot**.

It is a **multi-tenant SaaS CRM + AI conversation management platform** designed specifically for tourism businesses.

---

# Core Product Goals

The platform must allow tourism businesses to:

- Collect reservation inquiries from multiple channels
- Centralize conversations in one dashboard
- Automatically qualify potential guests
- Extract reservation information from conversations
- Assist reservation staff in managing conversations
- Convert inquiries into leads and bookings
- Track reservation opportunities
- Configure an AI reservation assistant

---

# Primary Communication Channels

The system should support the following channels:

- WhatsApp
- Instagram Direct Messages
- Website Live Chat

For MVP:

- Do NOT implement real integrations
- Build **webhook-ready architecture**
- Use **mock channel adapters**

Future integrations should be easily attachable.

---

# User Roles

## 1. Super Admin

System owner.

Permissions:

- Manage all tenants
- Manage subscription plans
- View system-wide statistics
- Manage platform configuration

---

## 2. Business Owner / Manager

Accommodation business owner.

Permissions:

- Manage property information
- Configure assistant settings
- View leads and reservations
- Access reports
- Manage team members
- Configure integrations

---

## 3. Reservation Staff

Reservation operators.

Permissions:

- Respond to conversations
- Manage leads
- Update reservation statuses
- Escalate conversations

---

# Technical Stack

Use the following stack:

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Recharts (charts)**

Architecture must be compatible with:

- PostgreSQL
- Prisma ORM
- Redis
- BullMQ
- Stripe billing
- external AI APIs

But **MVP must use mock services**.

---

# Design Philosophy

The UI must look like a **professional SaaS CRM product**.

Design characteristics:

- clean
- modern
- minimal
- professional
- B2B oriented
- tourism industry focused

Avoid flashy startup gimmicks.

Use:

- clean cards
- structured dashboards
- clear typography
- subtle borders
- balanced spacing

The interface must look **trustworthy and demo-ready for business owners**.

---

# Marketing Website

Create the following pages:

---

## Homepage Sections

The homepage must contain:

1. Hero section
2. Pain points
3. Solution explanation
4. Product workflow
5. Feature highlights
6. Pricing preview
7. FAQ preview
8. CTA sections
9. Footer

---

## Hero Section Content

Title:

AI Reservation Assistant for Tourism Businesses

Subtitle:

Automatically answer reservation inquiries from WhatsApp, Instagram DM, and website chat 24/7, and turn more messages into bookings.

Primary CTA:

Request Demo

---

# Application Dashboard

Authenticated app routes:

---

# Dashboard Layout

All dashboard pages must include:

- persistent sidebar navigation
- top navigation bar
- tenant context
- page header pattern
- responsive layout

Create reusable components.

---

# Core CRM Domain Model

Define TypeScript interfaces for:

- Tenant
- User
- Subscription
- Channel
- Property
- RoomType
- PricingRule
- AssistantConfig
- KnowledgeBaseEntry
- AutomationFlow
- Conversation
- Message
- Lead
- Reservation
- AuditLog

Use **mock data** to simulate realistic tourism CRM data.

---

# Conversation Intent Types

The assistant should detect these intents:

- reservation_request
- availability_check
- price_request
- property_info
- cancellation_change
- human_handoff
- other

---

# Reservation Information Extraction

Conversation parsing should support extracting:

- check_in
- check_out
- guest_count
- child_count
- room_type
- budget
- phone
- email
- name
- language

---

# Conversation Workflow

A typical system flow:

1. Message arrives from a channel
2. Normalize message format
3. Create or find conversation
4. Detect user intent
5. Extract reservation information
6. Ask for missing details
7. Retrieve knowledge base answers
8. Create or update lead
9. Offer booking next step
10. Escalate to human if needed

---

# MVP Scope

Build a **fully navigable CRM shell with mock data** including:

- landing page
- demo request form
- authentication pages
- onboarding flow
- dashboard overview
- conversations module
- leads module
- integrations module
- assistant configuration
- knowledge base management
- automation flows
- subscription management
- settings

---

# Dashboard Overview

Widgets must include:

- conversations today
- leads captured
- bookings won
- human handoffs
- channel distribution
- recent conversations
- conversion funnel
- top intents
- response time

Use charts where appropriate.

---

# Conversations Page

This is the **most important screen**.

Layout must contain **3 columns**:

Left column:

Conversation list.

Center column:

Chat thread.

Right column:

Lead information panel.

Include:

- filters
- channel indicators
- status badges
- message timeline
- internal notes
- assignment actions

Statuses:

- open
- waiting
- resolved

---

# Leads Page

Create a CRM-style table containing:

- guest name
- channel
- check-in
- check-out
- guests
- estimated value
- status
- assigned user
- last activity

Lead statuses:

- new
- qualified
- offer_sent
- won
- lost

---

# Integrations Page

Integration cards for:

- WhatsApp
- Instagram
- Webchat

Each card should show:

- connection status
- configuration summary
- connect button
- webhook information

---

# Assistant Settings

Allow configuring:

- brand tone
- supported languages
- welcome message
- fallback behavior
- human handoff rules
- after-hours behavior

---

# Knowledge Base

Admin interface to manage:

- property information
- room types
- policies
- FAQs

Include CRUD UI.

---

# Automation Flows

Create flow cards for:

- reservation intake
- missing information
- pricing request
- human handoff
- follow-up

No drag-and-drop required.

---

# Reports Page

Show analytics for:

- channel performance
- conversion rates
- peak hours
- top intents
- handoff ratio

Use charts.

---

# Subscription Page

Plans:

- Starter
- Growth
- Pro

Display:

- usage metrics
- plan features
- billing history
- upgrade options

---

# Settings Page

Sections:

- business profile
- property profile
- team management
- notifications
- account settings

---

# Reusable Components

Create reusable UI components:

- AppSidebar
- AppTopbar
- PageHeader
- StatCard
- ChartCard
- FilterBar
- StatusBadge
- ChannelBadge
- LeadStatusBadge
- ConversationList
- ChatThread
- LeadDetailPanel
- EmptyState
- SectionCard
- PricingCard
- IntegrationCard
- DataTable
- FormSection

---

# Mock Data

Create realistic datasets for:

- tenants
- users
- conversations
- messages
- leads
- reservations
- channels
- assistant configs
- subscriptions
- analytics metrics

The mock data should resemble **real tourism reservation activity**.

---

# Project Structure

Suggested structure:

Inside `/docs` create:

- product-prd.md
- sitemap.md
- dashboard-spec.md
- flows.md
- prompts.md
- api-spec.md

---

# Engineering Rules

- use strict TypeScript
- avoid `any`
- create reusable domain types
- separate data layer from UI
- keep components modular
- maintain consistent naming
- design for multi-tenancy

---

# Final Requirement

Generate a **complete MVP codebase** with:

1. folder structure
2. reusable types
3. mock services
4. layout shell
5. marketing pages
6. dashboard overview
7. conversations module
8. leads module
9. remaining modules
10. documentation files

The result must be **demo-ready** and look like a real SaaS CRM product for tourism businesses.