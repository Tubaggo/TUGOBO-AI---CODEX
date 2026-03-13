# Initial Folder Structure

This is the first implementation slice for the Tugobo AI CRM codebase.

## Top-Level Modules

- `app/`: Next.js App Router routes and layouts
- `components/`: reusable SaaS UI and CRM components
- `lib/domain/`: shared domain types and business vocabulary
- `lib/services/`: upcoming backend service layer modules
- `lib/conversation-engine/`: upcoming CRM conversation engine implementation
- `lib/assistant/`: upcoming AI reservation assistant logic
- `lib/mocks/`: upcoming mock repositories, adapters, and seed-like fixtures
- `prisma/`: Prisma schema and later seed script
- `docs/generated/`: implementation notes derived from the provided product docs

## Route Shell

- `app/page.tsx`: marketing/home placeholder
- `app/(dashboard)/layout.tsx`: authenticated app shell placeholder
- `app/(dashboard)/conversations/page.tsx`: conversations entry point
- `app/(dashboard)/leads/page.tsx`: leads entry point
- `app/(dashboard)/reservations/page.tsx`: reservations entry point
- `app/(dashboard)/settings/page.tsx`: assistant/settings entry point

The goal is to keep the app modular from the beginning so each domain module can grow independently without breaking tenant isolation.
