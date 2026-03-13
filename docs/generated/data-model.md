# Data Model Notes

The Prisma schema is based primarily on `docs/database-schema.md`, with a few additive fields needed to reconcile the other specs:

- `ConversationStatus` includes `HUMAN_HANDLING` because the conversation engine spec requires a takeover state.
- `ConversationIntent` includes both `CANCELLATION_CHANGE` and `CANCELLATION_REQUEST` because the docs use both terms.
- `Conversation.tagsJson` and `Lead.temperature` were added because the CRM and assistant specs require tagging and hot/warm/cold qualification.

## Tenant Isolation

Every business-owned entity includes `tenantId` and is indexed for tenant-scoped querying:

- conversations
- leads
- reservations
- properties
- channels
- automation flows
- audit logs

This supports a multi-tenant SaaS architecture while remaining mock-friendly for MVP work.

## One-to-One Decisions

- `Tenant -> Subscription` is modeled as one-to-one for the active subscription record.
- `Tenant -> AssistantConfig` is modeled as one-to-one.
- `Lead -> Reservation` is modeled as optional one-to-one.
- `Lead <-> Conversation` is modeled as optional one-to-one with the foreign key owned by `Lead`, which keeps the Prisma relation valid while still matching the CRM workflow where one inquiry thread typically becomes one lead.
