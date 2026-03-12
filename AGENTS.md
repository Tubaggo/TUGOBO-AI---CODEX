# AGENTS.md

## Purpose

This repository contains product and planning documentation for Tugobo AI, a SaaS AI reservation assistant for hotels and accommodation businesses.

Agents working in this repo should preserve one consistent product model across all docs:

- Tugobo AI is a B2B SaaS platform for hotels and accommodation operators.
- The product combines guest-facing AI conversations with staff-facing dashboard operations.
- The main business goals are direct-booking conversion, faster response times, and reduced manual reservation workload.
- The product scope includes channels, inbox, lead management, knowledge base, AI configuration, analytics, and integrations.

## Repo Structure

- `docs/product-prd.md`: product requirements, goals, personas, scope, milestones
- `docs/sitemap.md`: public site and app information architecture
- `docs/dashboard-spec.md`: dashboard pages, roles, widgets, and permissions
- `docs/flows.md`: guest, staff, escalation, follow-up, and lifecycle flows
- `docs/prompts.md`: AI prompt strategy, templates, guardrails, and evaluation
- `docs/api-spec.md`: API resources, endpoints, payloads, and service boundaries

## Working Rules

- Keep documentation internally consistent across all files.
- Prefer concrete product decisions over vague placeholder language.
- If adding new features, update every affected document, not just one.
- Keep terminology stable:
  - `property` for a hotel/accommodation entity
  - `conversation` for a channel thread
  - `lead` for a qualified commercial opportunity
  - `reservation` for a draft or confirmed stay record
- Use Markdown headings and concise sections.
- Default to ASCII unless the file already requires otherwise.

## Documentation Standards

- Write for product, design, engineering, and AI operations audiences.
- Make assumptions explicit when the repository has no implementation context.
- Separate MVP scope from future phases where relevant.
- For flows and API specs, prefer operational clarity over marketing language.
- For prompts, include guardrails against hallucinated availability, pricing, and policy claims.

## Change Checklist

Before finishing a documentation change, verify:

- The PRD, flows, dashboard, prompts, and API all describe the same lifecycle model.
- Channel names and dashboard sections match the sitemap.
- Prompt behavior does not conflict with policy or API capabilities.
- API examples use the same object model as the product docs.

## Out of Scope

Unless explicitly requested, do not add:

- implementation code
- design mockups
- vendor-specific integration details
- speculative pricing or legal claims
