# PISE Mentorship Portal MVP

Private mentorship portal for PISE.

## What It Does

The MVP supports:

```text
approved user login
mentor discovery
mentor filtering
mentor profile viewing
Calendly booking access
mentor profile self-management
admin publish/unpublish
external feedback link
```

It does not build native booking.

## Core Flow

```text
Admin creates mentor profile draft
→ Mentor completes profile
→ Admin publishes mentor
→ Mentee browses mentors
→ Mentee opens mentor profile
→ Mentee books via Calendly
```

## Docs

Main project docs are in `/docs`.

```text
01_PRD.md
02_MVP_FUNCTIONAL_SPEC.md
03_DATA_MODEL.md
04_UI_FLOW.md
05_BUILD_PLAN.md
06_TEST_PLAN.md
07_DESIGN_SYSTEM.md
```

Claude Code project rules are in:

```text
CLAUDE.md
```

## Stack

```text
Next.js
TypeScript
React
Tailwind CSS
Supabase
Vercel
```

## Local Setup

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment

Create `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
FEEDBACK_FORM_URL=
```

Do not commit `.env.local`.

## Build Order

Follow:

```text
/docs/05_BUILD_PLAN.md
```

## Test

Before launch, follow:

```text
/docs/06_TEST_PLAN.md
```

## First Claude Code Prompt

Use Plan Mode first.

```text
Read CLAUDE.md and the docs in /docs.

Do not implement yet.

Explore the project and summarize:
1. What product we are building
2. What is out of scope
3. What milestone we should start with
4. Any inconsistency in the docs

Plan only. No code.
```
