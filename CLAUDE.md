# CLAUDE.md

## Project

Build the PISE Mentorship Portal MVP.

Core product flow:

```text
Admin creates mentor profile draft
→ Mentor completes profile
→ Admin reviews and publishes
→ Mentee discovers mentor
→ Mentee books via Calendly
→ User opens external feedback form
```

## Source of Truth

Read relevant docs in `/docs` before implementation.

```text
01_PRD.md                 Product scope and rules
02_MVP_FUNCTIONAL_SPEC.md Functional behavior
03_DATA_MODEL.md          Tech stack, architecture, data model
04_UI_FLOW.md             Routes, screens, UI behavior
05_BUILD_PLAN.md          Build milestones
06_TEST_PLAN.md           Test checklist
07_DESIGN_SYSTEM.md       Visual system
```

Do not rely on memory. Use the docs.

## Core Rules

* Mentor owns profile content.
* Admin owns publishing control.
* Calendly owns booking.
* External form owns feedback.
* Build one milestone at a time.
* Follow `05_BUILD_PLAN.md`.
* Use `06_TEST_PLAN.md` before final readiness.

## Stack

Use:

```text
Next.js
TypeScript
React
Tailwind CSS
Supabase Auth
Supabase Postgres
Vercel
```

Do not create a separate backend.

Use Supabase SDK directly. Do not add ORM unless explicitly requested.

## Do Not Build

Never build these unless explicitly requested:

```text
native booking
booking/session/availability tables
Calendly API or webhook
Google Calendar / Google Meet integration
in-app feedback
feedback response database
admin analytics
admin user management UI
filter option management UI
image upload
support area filtering
advanced search
mentor ranking
AI matching
recommendations
payment
public signup
multi-role permissions
```

## Implementation Workflow

Use:

```text
Explore → Plan → Code → Commit
```

Before coding:

```text
1. Read relevant docs.
2. Inspect existing files.
3. Summarize the milestone goal.
4. List files to change.
5. Explain the plan.
```

After coding:

```text
1. Summarize changes.
2. List changed files.
3. Explain how to test.
4. Mention risks or assumptions.
```

Do not proceed to the next milestone unless asked.

## Final Rule

When unsure, choose the simpler MVP-safe implementation.
