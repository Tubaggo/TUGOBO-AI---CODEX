# Tugobo AI MVP

Sales-ready MVP demo for Tugobo AI, an AI reservation assistant built for hotels and accommodation businesses.

## What This Project Includes

This repository contains a minimal demo product built to help present Tugobo AI to potential customers.

Included pages:

- Landing page
- Demo chat page with a WhatsApp-style reservation conversation
- Leads page with captured reservation requests
- Business settings page

## Product Demo Story

The MVP is designed to show a simple sales flow:

1. A guest starts a reservation conversation.
2. Tugobo AI responds instantly and collects key stay details.
3. The conversation becomes a structured reservation lead.
4. The hotel can review settings that shape the assistant behavior.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui style component setup

## Project Structure

```text
app/
  page.tsx            # Landing page
  demo/page.tsx       # Demo chat page
  leads/page.tsx      # Leads table
  settings/page.tsx   # Business settings page

components/
  demo-chat.tsx
  demo-workspace.tsx
  lead-capture-panel.tsx
  leads-table.tsx
  business-settings-form.tsx
  ui/

lib/
  demo-data.ts        # Mock business, chat, and lead data
  utils.ts
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Demo Pages

- `/` landing page
- `/demo` live reservation chat demo
- `/leads` captured reservation leads
- `/settings` business settings

## Notes

- Uses mock data only
- No authentication
- No billing
- No advanced analytics
- Built for quick demos, not full production use
