# Backend Service Layer

The backend domain layer is intentionally split into pure services plus repository contracts.

## Why this structure

- Services in `lib/services/` contain tenant-aware business rules.
- Repository interfaces keep the services independent from Prisma client details.
- The same services can be used later with Prisma, mocks, seeds, or tests.

## Implemented Services

- `ConversationsService`: conversation CRUD-style orchestration, message append, internal notes, human handoff, lead sync from extracted reservation data
- `LeadsService`: lead create/update/list flows and reservation-data application
- `ReservationsService`: reservation validation, creation, update, confirmation, cancellation, and lead-to-reservation conversion
- `AssistantConfigService`: tenant-level assistant settings retrieval and upsert logic

## Next backend step

The next layer should add concrete repository implementations:

- Prisma-backed repositories for production structure
- mock/in-memory repositories for MVP demo data
