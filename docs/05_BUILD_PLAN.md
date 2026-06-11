# 05_BUILD_PLAN.md — Claude Code Build Plan

## 1. Purpose

This file defines the build order for the PISE Mentorship Portal MVP.

Claude Code should use this file to build the product milestone by milestone.

This file does not repeat all requirements. For details, read the referenced source docs.

---

## 2. Source Docs

Use these docs as source of truth:

```text
01_PRD.md              = product scope and rules
02_MVP_FUNCTIONAL_SPEC.md = functional behavior
03_DATA_MODEL.md       = database, auth, data rules
04_UI_FLOW.md          = screens, flows, UI states
07_DESIGN_SYSTEM.md    = visual style and components
06_TEST_PLAN.md        = testing checklist
```

Before implementing a milestone, read only the docs relevant to that milestone.

---

## 3. Core Build Rules

Always follow these rules:

* Build one milestone at a time.
* Do not add features outside MVP scope.
* Do not create extra routes unless explicitly requested.
* Do not create extra database tables unless explicitly requested.
* Do not build native booking.
* Do not integrate Calendly API or webhook.
* Do not integrate Google Calendar or Google Meet.
* Do not build in-app feedback.
* Do not build admin analytics.
* Do not build admin user management UI.
* Do not build image upload.
* Do not build AI matching, ranking, recommendation, or advanced search.
* Do not build support area filtering.
* Keep implementation simple.

---

## 4. Required MVP Routes

Build only these routes:

```text
/login
/access-denied
/home
/mentors
/mentors/[slug]
/mentor/profile
/admin
/admin/mentors
/admin/mentors/new
/admin/mentors/[id]/edit
```

Do not build:

```text
/feedback
/admin/users
/admin/analytics
/admin/feedback
/admin/filter-options
```

---

## 5. Build Milestones

Build in this order:

```text
0. Project setup
1. Supabase schema
2. Design tokens and app shell
3. Invite-only login and route protection
4. Role-based home page
5. Mentor browsing and filters
6. Mentor profile page
7. Mentor profile management
8. Admin mentor management
9. Polish and responsive states
10. Final readiness check
```

---

# Milestone 0 — Project Setup

## Read

```text
01_PRD.md
02_MVP_FUNCTIONAL_SPEC.md
```

## Build

* Initialize or inspect Next.js project.
* Confirm TypeScript and Tailwind are set up.
* Add `/docs` folder.
* Add project docs.
* Add `CLAUDE.md`.

## Done When

* Project runs locally.
* Docs are available.
* `CLAUDE.md` includes MVP scope rules.

---

# Milestone 1 — Supabase Schema

## Read

```text
03_DATA_MODEL.md
```

## Build

Create migration and seed files for:

```text
app_users
mentor_profiles
filter_options
app_config
```

## Important

Mentor profiles must support incomplete unpublished drafts.

Required profile fields should be validated during completeness/publish checks, not enforced too strictly by database `NOT NULL`.

## Done When

* Required tables exist.
* Filter options are seeded.
* Feedback form config placeholder exists.
* No booking/session/feedback-response tables exist.

---

# Milestone 2 — Design Tokens and App Shell

## Read

```text
04_UI_FLOW.md
07_DESIGN_SYSTEM.md
```

## Build

* Configure Inter font.
* Add color tokens.
* Build global layout.
* Build simple authenticated app shell.
* Build shared base components.

## Components

```text
AppHeader
PageHeader
EmptyState
LoadingState
ErrorMessage
MentorTag
CalendlyButton
FeedbackLink
AdminStatusBadge
```

## Done When

* Visual foundation follows design system.
* Vietnamese text renders correctly.
* App shell works on desktop and mobile.

---

# Milestone 3 — Invite-Only Login and Route Protection

## Read

```text
02_MVP_FUNCTIONAL_SPEC.md
03_DATA_MODEL.md
04_UI_FLOW.md
```

## Build

* `/login`
* `/access-denied`
* Supabase auth helpers
* current app user lookup
* route protection
* role checks

## Done When

* Approved active users can log in.
* Unknown users are blocked.
* Inactive users are blocked.
* Admin routes require admin role.
* Mentor profile management requires mentor role.

---

# Milestone 4 — Role-Based Home Page

## Read

```text
02_MVP_FUNCTIONAL_SPEC.md
04_UI_FLOW.md
07_DESIGN_SYSTEM.md
```

## Build

* `/home`
* role-specific content and CTAs
* external feedback link if configured

## Done When

* Mentee sees mentor browsing CTA.
* Mentor sees profile management CTA and profile status.
* Admin sees mentor management CTA.
* No dashboard is built.

---

# Milestone 5 — Mentor Browsing and Filters

## Read

```text
02_MVP_FUNCTIONAL_SPEC.md
03_DATA_MODEL.md
04_UI_FLOW.md
07_DESIGN_SYSTEM.md
```

## Build

* `/mentors`
* published mentor list
* mentor cards
* filters for location, disciplines, industries
* clear filters
* empty states

## Done When

* Only published mentors are shown.
* Filters work.
* Support areas show as tags only.
* No search, ranking, matching, or recommendation is built.

---

# Milestone 6 — Mentor Profile Page

## Read

```text
02_MVP_FUNCTIONAL_SPEC.md
04_UI_FLOW.md
07_DESIGN_SYSTEM.md
```

## Build

* `/mentors/[slug]`
* mentor profile detail
* Calendly external CTA
* external feedback link

## Done When

* Published mentor profile is viewable.
* Unpublished mentor is hidden from mentees.
* Calendly opens in a new tab.
* No booking data is created.

---

# Milestone 7 — Mentor Profile Management

## Read

```text
02_MVP_FUNCTIONAL_SPEC.md
03_DATA_MODEL.md
04_UI_FLOW.md
07_DESIGN_SYSTEM.md
```

## Build

* `/mentor/profile`
* own linked mentor profile lookup
* profile status card
* editable mentor profile form
* save action
* URL validation
* missing fields display

## Done When

* Mentor can edit own profile content.
* Mentor can update own Calendly URL.
* Mentor sees complete/incomplete status.
* Mentor sees published/unpublished status.
* Mentor cannot publish themselves.
* Mentor cannot edit another mentor profile.

---

# Milestone 8 — Admin Mentor Management

## Read

```text
02_MVP_FUNCTIONAL_SPEC.md
03_DATA_MODEL.md
04_UI_FLOW.md
07_DESIGN_SYSTEM.md
```

## Build

* `/admin`
* `/admin/mentors`
* `/admin/mentors/new`
* `/admin/mentors/[id]/edit`
* create mentor profile draft
* edit mentor profile
* link mentor user
* publish/unpublish

## Done When

* Admin can create unpublished mentor profile draft.
* Admin can edit mentor profile.
* Admin can link mentor user.
* Admin can publish complete mentor.
* Admin cannot publish incomplete mentor.
* Admin can unpublish mentor.
* Unpublished mentor is hidden from mentees.

---

# Milestone 9 — Polish and Responsive States

## Read

```text
04_UI_FLOW.md
07_DESIGN_SYSTEM.md
06_TEST_PLAN.md
```

## Build

* mobile polish
* empty states
* loading states
* error states
* warning states
* spacing consistency
* button consistency
* tag consistency
* form consistency

## Done When

* UI is usable on mobile.
* Forms are readable.
* Error and empty states are clear.
* Design system is consistently applied.

---

# Milestone 10 — Final Readiness Check

## Read

```text
01_PRD.md
02_MVP_FUNCTIONAL_SPEC.md
03_DATA_MODEL.md
04_UI_FLOW.md
06_TEST_PLAN.md
07_DESIGN_SYSTEM.md
```

## Check

* approved login works
* unapproved/inactive users are blocked
* mentees can browse/filter/open mentor profiles
* Calendly links open externally
* mentors can update own profile
* mentors cannot publish
* admins can create/publish/unpublish mentors
* unpublished mentors are hidden
* external feedback link works
* no out-of-scope feature exists

## Done When

The MVP supports this flow:

```text
Admin creates mentor profile draft
→ Mentor completes profile
→ Admin publishes mentor
→ Mentee finds mentor
→ Mentee opens mentor profile
→ Mentee books through Calendly
→ User opens external feedback form
```

---

## 6. Implementation Protocol

Before coding a milestone:

```text
1. Read the milestone’s referenced docs.
2. Inspect existing code.
3. Summarize the milestone goal.
4. List files to create or change.
5. Explain implementation approach.
```

After coding:

```text
1. Summarize what changed.
2. List changed files.
3. Explain how to test.
4. Mention risks or assumptions.
```

Do not move to the next milestone unless asked.

---

## 7. Stop Rules

Stop and ask before proceeding if implementation requires:

```text
extra database tables
extra routes
native booking
Calendly API/webhook
Google Calendar integration
in-app feedback
admin analytics
admin user management UI
image upload
AI matching
ranking
support area filtering
multi-role permissions
large refactor unrelated to the milestone
```

---

## 8. Final Rule

The correct MVP is simple:

```text
mentor discovery
mentor profile management
admin publishing
Calendly booking access
external feedback link
```

When unsure, choose the simpler implementation and follow the docs.
