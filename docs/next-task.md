# Next Task

## Exact Next Task For The Next Codex Session
Implement Prisma-backed repository adapters for the CRM conversation flow without changing the current UI.

## Scope
- Start with the Conversations domain only.
- Add Prisma-backed repositories for:
  - conversations
  - messages
  - leads
  - reservations lookup needed by the Conversations page
- Keep the current mock modules as fallback/demo data.
- Do not redesign pages or change routing.

## Acceptance Criteria
- Conversations page can read from Prisma-backed repositories behind the existing service layer.
- Existing demo scenarios still work when mock mode is used.
- `/conversations`, `/leads`, and `/reservations` remain stable.
- `npm run typecheck` passes.
- `npm run build` passes.

## Implementation Notes
- Follow the existing modular structure in `lib/services`, `lib/repositories`, and `lib/mocks`.
- Prefer direct file imports in the Conversations dependency chain.
- Keep server actions exporting only async functions.
- Keep changes small and verifiable.
