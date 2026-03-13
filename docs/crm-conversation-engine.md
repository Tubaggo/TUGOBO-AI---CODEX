# Tugobo AI - CRM Conversation Engine Prompt

## Purpose

This document defines the architecture and requirements for the **Conversation Engine** of Tugobo AI.

The Conversation Engine is the **core module of the CRM**.  
It manages all incoming messages, conversations, lead extraction, and human handoff workflows.

This system centralizes messages coming from:

- WhatsApp
- Instagram DM
- Website live chat

The goal is to create a **unified conversation inbox similar to Intercom or HubSpot**, but optimized for tourism reservation workflows.

---

# Core Responsibilities

The Conversation Engine must:

- Normalize messages from multiple channels
- Create or retrieve conversations
- Store message history
- Extract reservation-related information
- Detect user intent
- Generate or update leads
- Support AI + human collaboration
- Track conversation status
- Allow staff takeover when necessary

---

# Conversation Data Model

Define strong TypeScript interfaces for the following:

### Conversation

Properties:

- id
- tenant_id
- channel
- guest_name
- guest_phone
- guest_email
- language
- status
- assigned_user
- lead_id
- created_at
- last_message_at

Conversation statuses:

- open
- waiting
- resolved
- archived

---

### Message

Properties:

- id
- conversation_id
- sender_type (guest, assistant, human)
- message_type (text, system, note)
- content
- channel
- created_at

---

### Conversation Intent

Supported intents:

- reservation_request
- availability_check
- price_request
- property_info
- cancellation_request
- human_handoff
- other

---

# Reservation Information Extraction

The conversation engine must support extracting:

- check_in
- check_out
- guest_count
- child_count
- room_type
- budget
- name
- email
- phone
- language

These fields should update the **Lead entity** automatically.

---

# Conversation Workflow

Message processing pipeline:

1. Incoming message received
2. Normalize message format
3. Find or create conversation
4. Store message
5. Detect intent
6. Extract reservation data
7. Update lead information
8. Determine next action
9. Generate assistant reply or escalate

---

# Inbox Interface

Build a **3-column CRM conversation interface**.

### Column 1 — Conversation List

Includes:

- guest name
- last message preview
- channel icon
- unread indicator
- conversation status
- assigned staff

Filters:

- channel
- status
- assigned user

---

### Column 2 — Chat Thread

Features:

- message timeline
- assistant vs human indicators
- channel indicators
- timestamps
- typing indicator placeholder

Staff actions:

- reply
- internal note
- mark as resolved
- assign conversation
- convert to lead

---

### Column 3 — Lead Panel

Shows extracted reservation data:

- guest name
- phone
- email
- check-in
- check-out
- guests
- children
- room preference
- estimated value

Actions:

- update lead
- create reservation
- assign staff
- add tags

---

# Human Handoff

The system must support **human takeover**.

Triggers:

- guest requests human
- AI confidence is low
- reservation complexity detected
- staff manually takes control

When human takes over:

- AI stops replying
- conversation marked "human_handling"

---

# Internal Notes

Allow staff to add notes that are not visible to guests.

Properties:

- author
- content
- timestamp

---

# Conversation Tags

Allow tagging conversations.

Examples:

- VIP
- High Budget
- Group Booking
- Returning Guest

---

# Metrics

The conversation engine must track:

- response time
- human handoff rate
- conversation resolution rate
- lead conversion rate

---

# Mock Data

Generate realistic conversation datasets including:

- WhatsApp inquiries
- Instagram DM requests
- web chat conversations

Messages should resemble real reservation inquiries.

Example:

"Hi, do you have availability from July 15 to July 18 for two people?"

---

# Output Requirement

Generate a complete **conversation module** including:

- conversation list UI
- chat thread component
- lead detail panel
- filters
- message components
- mock conversation dataset
- conversation service layer

The module must be integrated with the **main dashboard layout**.