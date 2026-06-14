# 00_PROJECT_STATUS.md — Project Handoff

## Current Status

Completed:

```text
Milestone 0 — Project setup
Milestone 1 — Supabase schema and seed data
Milestone 2 — Design tokens and app shell
```

Next:

```text
Milestone 3 — Invite-only login and route protection
```

## Database State

Supabase migration and seed have been applied successfully.

Public schema has only these MVP tables:

```text
app_config
app_users
filter_options
mentor_profiles
```

Seed check:

```text
filter_options = 39 rows
app_config includes feedback_form_url
```

Important schema decision:

```text
Use role_title, not current_role.
```

## UI State

Milestone 2 added:

```text
Inter font
Tailwind v4 design tokens
PISE app shell
Default Next.js page replacement
Reusable base components in src/components/
```

## Next Milestone Scope

Milestone 3 should build:

```text
Supabase Auth setup
approved-user login
app_users whitelist check
inactive user blocking
role detection
route protection
access-denied behavior
```

Milestone 3 must not build:

```text
mentor browsing
mentor profile management
admin mentor management
native booking
Calendly API/webhook
in-app feedback
admin analytics
image upload
AI matching
```

## Resume Prompt

Use this prompt when starting next session:

```text
Read CLAUDE.md and docs/00_PROJECT_STATUS.md.

Do not implement yet.

We are starting Milestone 3: invite-only login and route protection.

Summarize:
1. Current project status
2. What Milestone 3 should build
3. What Milestone 3 must not build
4. Files likely to change
5. Risks or assumptions

Plan only. No code.
```
