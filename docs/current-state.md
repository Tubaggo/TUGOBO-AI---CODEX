# Current State

## What Works
- Next.js App Router project builds and typechecks successfully.
- `/conversations`, `/leads`, and `/reservations` load successfully.
- Conversations demo supports:
  - scenario switching
  - AI reservation insight panel
  - AI reply generation
  - availability and pricing suggestions
  - reservation draft suggestion
  - one-click mock reservation creation
- Leads and Reservations pages render from the current mock CRM data.
- Query-param scenario URLs are stable:
  - `/conversations?conversation=conv_anna`
  - `/conversations?conversation=conv_julia`
  - `/conversations?conversation=conv_omar`

## Known Issues
- The app is still mostly mock-backed. Prisma-backed repositories are not fully wired into the CRM UI flow.
- Next.js dev mode has been sensitive to fragile import chains; the Conversations route was stabilized by removing wrapper/barrel imports in its dependency path.
- Windows local development may still need cache cleanup after dependency graph changes. Use `npm run reset:dev` or `run-clean-dev.bat`.
- Runtime behavior has been smoke-tested on built output, not fully browser-tested for every interaction.

## Priority Order
1. Keep Conversations stable in dev mode.
2. Replace remaining mock CRM reads/writes with Prisma-backed repositories.
3. Convert AI outputs from demo-only display into persisted CRM actions where appropriate.
4. Harden reservation creation and lead/reservation synchronization.
5. Add higher-confidence testing for demo-critical flows.

## Safe Development Rules
- Do not refactor routing or dashboard layout unless required by the task.
- Prefer direct imports over `index.ts` barrel imports in the Conversations path.
- Avoid wrapper re-export files for client/server boundary components.
- Do not import server-only modules into client components.
- Keep mock data flow stable unless the task explicitly changes demo scenarios.
- Validate every change with:
  - `npm run typecheck`
  - `npm run build`
- If Next dev gets into a bad state on Windows, use:
  - `npm run reset:dev`
  - or `run-clean-dev.bat`
