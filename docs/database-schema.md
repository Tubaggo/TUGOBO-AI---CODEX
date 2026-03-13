# Tugobo AI - Database Schema Prompt

## Purpose

This document defines the **database architecture and domain schema** for Tugobo AI.

Tugobo AI is a **multi-tenant SaaS CRM and AI-powered reservation management platform** for tourism accommodation businesses.

The database must support:

- multi-tenant business accounts
- users and permissions
- properties and room types
- conversations and messages
- lead management
- reservation workflows
- assistant configurations
- knowledge base content
- automation flows
- subscriptions and usage tracking
- audit logs

This schema should be designed for **PostgreSQL + Prisma ORM**.

---

# Core Architecture Principles

The schema must follow these principles:

- multi-tenant first
- scalable and normalized
- easy to query
- compatible with SaaS subscriptions
- compatible with future AI workflows
- mock-friendly for MVP, production-ready in structure

Each business account is a **tenant**.

All tenant data must be logically isolated.

---

# Main Entities

The schema must include the following models:

- Tenant
- User
- TeamMember / Membership
- Subscription
- UsageMetric
- Property
- RoomType
- PricingRule
- Channel
- Conversation
- Message
- InternalNote
- Lead
- Reservation
- KnowledgeBaseEntry
- AssistantConfig
- AutomationFlow
- AuditLog

---

# 1. Tenant

Represents one tourism business account.

Fields:

- id
- name
- slug
- business_type
- phone
- email
- website
- country
- city
- address
- timezone
- currency
- created_at
- updated_at
- is_active

Relationships:

- has many users through memberships
- has one or more properties
- has many channels
- has many conversations
- has many leads
- has many reservations
- has one subscription
- has one assistant config
- has many knowledge base entries
- has many automation flows
- has many audit logs

---

# 2. User

Represents a platform user.

Fields:

- id
- full_name
- email
- phone
- password_hash
- avatar_url
- role_type
- created_at
- updated_at
- is_active
- last_login_at

Role types:

- super_admin
- owner
- manager
- reservation_staff

A user may belong to one or more tenants in future-ready design, but MVP can assume one primary membership.

---

# 3. Membership

Join table between user and tenant.

Fields:

- id
- tenant_id
- user_id
- role
- created_at

Role values:

- owner
- manager
- reservation_staff

This makes the SaaS model more flexible.

---

# 4. Subscription

Represents tenant billing and plan information.

Fields:

- id
- tenant_id
- plan_name
- plan_code
- billing_cycle
- status
- started_at
- ends_at
- stripe_customer_id
- stripe_subscription_id
- created_at
- updated_at

Plan examples:

- starter
- growth
- pro

Status values:

- trialing
- active
- past_due
- canceled
- expired

Billing cycle values:

- monthly
- yearly

Each tenant has at most one active subscription.

---

# 5. UsageMetric

Tracks plan usage for feature gating and billing dashboards.

Fields:

- id
- tenant_id
- metric_type
- value
- period_start
- period_end
- created_at

Metric types:

- conversations_count
- ai_messages_count
- leads_count
- reservations_count
- team_members_count
- channels_count

---

# 6. Property

Represents an accommodation business property.

Fields:

- id
- tenant_id
- name
- property_type
- description
- city
- country
- address
- latitude
- longitude
- phone
- email
- check_in_time
- check_out_time
- amenities_json
- created_at
- updated_at
- is_active

Property types:

- hotel
- boutique_hotel
- apart_hotel
- pension
- bungalow
- glamping
- villa
- other

A tenant may have one or multiple properties in future-ready structure.

---

# 7. RoomType

Represents bookable room inventory categories.

Fields:

- id
- property_id
- name
- code
- description
- capacity_adults
- capacity_children
- base_price
- currency
- amenities_json
- created_at
- updated_at
- is_active

Examples:

- Standard Room
- Deluxe Room
- Family Bungalow
- Sea View Suite

---

# 8. PricingRule

Represents pricing logic or seasonal rate rules.

Fields:

- id
- property_id
- room_type_id
- name
- season_name
- start_date
- end_date
- min_nights
- price_per_night
- currency
- created_at
- updated_at
- is_active

Can be extended later for dynamic pricing logic.

---

# 9. Channel

Represents communication channels connected to the tenant.

Fields:

- id
- tenant_id
- type
- display_name
- status
- external_account_id
- webhook_url
- metadata_json
- connected_at
- created_at
- updated_at

Channel types:

- whatsapp
- instagram
- webchat

Channel status values:

- connected
- disconnected
- pending
- error

---

# 10. Conversation

Represents a guest conversation thread.

Fields:

- id
- tenant_id
- channel_id
- lead_id
- assigned_user_id
- guest_name
- guest_phone
- guest_email
- guest_language
- status
- source
- intent
- ai_enabled
- human_handoff
- first_message_at
- last_message_at
- created_at
- updated_at

Status values:

- open
- waiting
- resolved
- archived

Intent values:

- reservation_request
- availability_check
- price_request
- property_info
- cancellation_change
- human_handoff
- other

Source examples:

- whatsapp
- instagram
- webchat

A conversation belongs to one tenant and may be linked to one lead.

---

# 11. Message

Represents messages inside a conversation.

Fields:

- id
- conversation_id
- sender_type
- sender_user_id
- message_type
- content
- raw_payload_json
- created_at

Sender types:

- guest
- assistant
- human
- system

Message types:

- text
- note
- system
- attachment_placeholder

Messages should be ordered by created_at.

---

# 12. InternalNote

Represents private staff-only notes attached to a conversation or lead.

Fields:

- id
- tenant_id
- conversation_id
- lead_id
- author_user_id
- content
- created_at
- updated_at

These notes are not visible to guests.

---

# 13. Lead

Represents a reservation opportunity.

Fields:

- id
- tenant_id
- conversation_id
- assigned_user_id
- full_name
- email
- phone
- language
- check_in
- check_out
- guest_count
- child_count
- room_type_preference
- budget
- estimated_value
- currency
- source_channel
- status
- priority
- tags_json
- last_activity_at
- created_at
- updated_at

Lead statuses:

- new
- qualified
- offer_sent
- won
- lost

Priority values:

- low
- medium
- high

Source channel values:

- whatsapp
- instagram
- webchat

A lead can be created automatically from conversation data extraction.

---

# 14. Reservation

Represents a confirmed or in-progress booking process.

Fields:

- id
- tenant_id
- lead_id
- property_id
- room_type_id
- reservation_code
- guest_name
- guest_email
- guest_phone
- check_in
- check_out
- adult_count
- child_count
- total_price
- currency
- status
- notes
- created_at
- updated_at

Reservation statuses:

- draft
- pending
- confirmed
- canceled
- completed

A reservation may be created from a lead.

---

# 15. KnowledgeBaseEntry

Represents information the assistant can use.

Fields:

- id
- tenant_id
- property_id
- category
- title
- content
- language
- sort_order
- created_at
- updated_at
- is_active

Categories:

- faq
- policy
- room_info
- amenities
- location
- checkin_checkout
- pricing_info
- general

---

# 16. AssistantConfig

Represents tenant-level AI assistant settings.

Fields:

- id
- tenant_id
- tone
- welcome_message
- fallback_message
- supported_languages_json
- handoff_rules_json
- business_hours_json
- response_style
- collect_phone
- collect_email
- collect_dates
- created_at
- updated_at

This should store configurable AI assistant behavior.

---

# 17. AutomationFlow

Represents configured CRM/assistant automation rules.

Fields:

- id
- tenant_id
- name
- flow_type
- description
- config_json
- is_active
- created_at
- updated_at

Flow types:

- reservation_intake
- missing_information
- pricing
- human_handoff
- follow_up

---

# 18. AuditLog

Tracks important system actions.

Fields:

- id
- tenant_id
- user_id
- entity_type
- entity_id
- action
- metadata_json
- created_at

Examples:

- lead_status_changed
- conversation_assigned
- assistant_config_updated
- reservation_created
- subscription_updated

---

# Relationships Summary

Required relationship logic:

- Tenant -> many Memberships
- User -> many Memberships
- Tenant -> one Subscription
- Tenant -> many UsageMetrics
- Tenant -> many Properties
- Property -> many RoomTypes
- RoomType -> many PricingRules
- Tenant -> many Channels
- Tenant -> many Conversations
- Conversation -> many Messages
- Conversation -> many InternalNotes
- Conversation -> optional Lead
- Tenant -> many Leads
- Lead -> many InternalNotes
- Lead -> optional Reservation
- Property -> many Reservations
- RoomType -> many Reservations
- Tenant -> many KnowledgeBaseEntries
- Tenant -> one AssistantConfig
- Tenant -> many AutomationFlows
- Tenant -> many AuditLogs

---

# Prisma Requirements

Generate:

1. A full Prisma schema
2. Enums where appropriate
3. Proper relations
4. `createdAt` / `updatedAt` fields
5. Optional vs required fields carefully modeled
6. Reasonable indexing suggestions for:
   - tenant_id
   - conversation_id
   - lead_id
   - status
   - channel type
   - created_at
   - last_message_at

Use Prisma conventions:

- `@id`
- `@default(cuid())` or `@default(uuid())`
- `@updatedAt`
- relation fields
- enums for status/role types where appropriate

---

# Seed Data Requirement

Also generate realistic seed data for:

- 1 super admin
- 2 tenants
- 3-5 tenant users
- 2-3 properties
- room types
- channels
- conversations
- messages
- leads
- reservations
- knowledge base entries
- subscriptions
- assistant configs

The seed data should reflect real tourism reservation use cases.

---

# Output Expectation

Generate:

- `prisma/schema.prisma`
- seed file
- TypeScript domain types if needed
- short `docs/data-model.md` explanation

The final schema should be:

- clear
- scalable
- SaaS-ready
- CRM-ready
- compatible with the Tugobo AI product vision