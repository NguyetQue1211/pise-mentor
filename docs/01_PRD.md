# 01_PRD.md — PISE Mentorship Portal MVP

## 1. Purpose

This document defines the product intent, MVP scope, and core product rules for the PISE Mentorship Portal.

This PRD is written for both human stakeholders and AI coding agents.

For vibe coding, use this document to understand:

* what product we are building,
* who it is for,
* what must be included,
* what must not be built,
* and which product rules must never be violated.

Do not use this PRD as the full technical specification. Implementation details should be defined in separate build documents such as functional spec, data model, UI flow, design system, build plan, and test plan.

---

## 2. Product Summary

The PISE Mentorship Portal is a lightweight private web platform for PISE’s mentorship program.

It helps approved mentees:

* browse available mentors,
* filter mentors by relevant criteria,
* understand what each mentor can support,
* open mentor profiles,
* prepare before booking,
* and book a 1:1 mentorship session through the mentor’s own Calendly link.

It helps mentors:

* create and maintain their own mentor profile,
* explain what they can help with,
* define what type of mentee they are suitable for,
* provide suggested topics mentees can ask about,
* update their own Calendly booking link,
* and manage their actual availability directly in Calendly.

It helps PISE admins:

* control access to the portal,
* create mentor profile shells,
* review mentor profile readiness,
* publish or unpublish mentor profiles,
* and keep the mentorship portal ready for mentees.

The MVP does not build a native booking system.

Calendly is responsible for:

* mentor availability,
* booking confirmation,
* calendar invite,
* meeting link,
* reminder emails,
* rescheduling,
* and cancellation.

The PISE portal is responsible for:

* invite-only access,
* mentor discovery,
* mentor profile presentation,
* mentee preparation guidance,
* Calendly booking access,
* mentor profile self-management,
* admin publishing control,
* and external feedback form access.

---

## 3. Background

PISE runs a mentorship program where mentors and mentees are selected or invited by the PISE team.

The key problem is not only booking a meeting. The bigger problem is helping mentees find the right mentor and prepare enough context so the mentorship session is useful.

Building a full booking system would make the MVP too complex. It would require calendar integration, availability management, meeting link generation, reminders, rescheduling logic, attendance tracking, and ongoing maintenance.

To keep the MVP simple, each mentor uses their own Calendly account. The PISE portal provides the discovery, profile, and booking access layer.

---

## 4. Product Goal

The MVP goal is to launch a simple mentorship portal where:

* approved users can log in,
* mentees can browse published mentors,
* mentees can discover mentors through structured profile attributes,
* mentees can filter mentors by location, discipline, and industry,
* mentees can understand what each mentor can help with before booking,
* mentees can open a mentor profile and understand mentor fit,
* mentees can book through the mentor’s Calendly link,
* mentors can complete and maintain their own profile content,
* mentors can update their own Calendly link,
* admins can create mentor profile shells,
* admins can review mentor readiness,
* admins can publish and unpublish mentor profiles,
* and PISE can collect basic post-session feedback through an external form.

The product should make mentor discovery clearer without building a complex matching system.

---

## 5. User Roles

## 5.1 Mentee

Mentees use the portal to:

* log in with approved access,
* browse mentors,
* filter mentors,
* view mentor profiles,
* understand mentor fit,
* book through Calendly,
* and access the external feedback form after a session.

## 5.2 Mentor

Mentors use the portal to maintain their own mentor profile and booking link.

Mentors can:

* view their own profile,
* edit their own profile content,
* update their own Calendly booking link,
* update booking instructions,
* see whether their profile is published or unpublished,
* see whether their profile is incomplete,
* and manage actual availability directly in Calendly.

Mentors cannot publish or unpublish themselves.

PISE admin controls whether a mentor profile is visible to mentees.

## 5.3 Admin

Admins manage portal readiness and publishing.

Admins can:

* manage approved access,
* create mentor profile shells,
* link a mentor profile to a mentor user,
* review mentor profile completeness,
* edit or override mentor profile content if needed,
* publish or unpublish mentor profiles,
* test Calendly links manually,
* and manage the external feedback form link if needed.

Admins are not responsible for writing every mentor profile from scratch. Mentors should own and maintain their own profile content.

---

## 6. MVP Scope

## 6.1 Invite-Only Login

The portal must be private.

Only approved users should be able to access the portal.

Recommended MVP login approach:

* email magic link login,
* whitelist-based access,
* no public signup.

Acceptance criteria:

* approved active users can log in,
* unapproved users cannot access the portal,
* inactive users cannot access the portal,
* users are assigned one primary role: mentee, mentor, or admin.

---

## 6.2 Home Page

After login, users should see a simple home page.

For mentees, the home page should explain:

* what the mentorship portal is,
* how to browse mentors,
* how to prepare before booking,
* and how to start finding a mentor.

For mentors, the home page should guide them to complete or update their mentor profile.

For admins, the home page should provide simple entry points to mentor management.

Acceptance criteria:

* user understands the purpose of the portal,
* mentee can navigate to the mentor list,
* mentor can navigate to their profile management page,
* admin can navigate to mentor management,
* page works on desktop and mobile.

---

## 6.3 Mentor List Page

The mentor list page helps mentees browse published mentors.

The page should not be only a flat list. Each mentor card should communicate mentor fit clearly.

Each mentor card should show:

* mentor photo or avatar,
* mentor name,
* current role or short title,
* location,
* key disciplines,
* key industries,
* support area tags,
* short description,
* and “View Profile” action.

Acceptance criteria:

* only published mentors are visible to mentees,
* mentor cards are easy to scan,
* each mentor card clearly communicates what the mentor can help with,
* mentees can open a mentor profile from the card,
* mentors without a valid Calendly link are not shown as bookable,
* mentor browsing works well on desktop and mobile.

---

## 6.4 Mentor Filters

Mentees should be able to filter mentors using simple, practical categories.

The MVP should support these required filter groups:

* location,
* discipline,
* industry.

Location helps mentees understand the mentor’s geography, timezone, or local context. It should not block online mentorship.

Disciplines describe the mentor’s professional or skill-based focus areas.

Industries describe the sectors or work environments where the mentor has experience.

Support areas or expertise tags should be shown on mentor cards and profiles. Do not build support area filtering unless explicitly requested later.

Acceptance criteria:

* user can apply one or more filters,
* mentor list updates based on selected filters,
* user can clear filters,
* empty state appears when no mentors match,
* filter values can be updated without changing product logic,
* MVP does not include advanced search, ranking, or AI matching.

---

## 6.5 Mentor Profile Page

Each mentor should have a profile page that helps mentees decide whether the mentor is a good fit before booking.

The profile should show:

* name,
* photo or avatar,
* current role or background,
* location,
* disciplines,
* industries,
* short bio,
* support areas or expertise tags,
* what this mentor can help with,
* suitable mentee profile,
* suggested topics mentees can ask about,
* booking instruction,
* and Calendly booking CTA.

Acceptance criteria:

* mentee can understand the mentor’s background,
* mentee can understand what the mentor can help with,
* mentee can decide whether the mentor is relevant before booking,
* mentee can access the mentor’s Calendly link,
* profile is readable on desktop and mobile.

---

## 6.6 Mentor Profile Management

Mentors should be able to complete and maintain their own profile.

This is important because mentors understand their own background, strengths, suitable mentees, and support areas better than PISE admins.

Mentors can edit:

* photo or avatar URL,
* current role or title,
* short bio,
* location,
* disciplines,
* industries,
* support areas or expertise tags,
* what this mentor can help with,
* suitable mentee profile,
* suggested topics mentees can ask about,
* booking instruction,
* Calendly booking link.

Mentors cannot edit:

* published status,
* linked user account,
* admin-only fields,
* internal readiness status.

Acceptance criteria:

* mentor can log in,
* mentor can access their own profile management page,
* mentor can update their own profile content,
* mentor can update their own Calendly URL,
* system validates required fields and URL format,
* mentor cannot edit another mentor’s profile,
* mentor cannot publish or unpublish themselves,
* updated content appears on the mentor profile according to publishing rules.

---

## 6.7 Calendly Booking Access

Each mentor has one active Calendly booking link stored in their profile.

The mentor profile page should show a clear booking CTA:

`Book via Calendly`

The CTA should open the mentor’s Calendly link in a new tab.

Calendly handles the actual booking flow.

Acceptance criteria:

* published mentor profile has a valid Calendly URL,
* mentee can open the Calendly link,
* booking happens outside the PISE portal,
* PISE portal does not create or manage bookings internally.

---

## 6.8 Admin Mentor Management

Admins manage mentor readiness and publishing.

Admin can:

* create a mentor profile shell,
* link a mentor profile to a mentor user,
* edit or override mentor profile content if needed,
* check profile completeness,
* add or update Calendly link if needed,
* publish mentor,
* unpublish mentor.

Acceptance criteria:

* admin can create mentor profile shells,
* admin can link mentor profile to mentor user,
* admin can review mentor profile completeness,
* admin can publish only mentors with required information,
* unpublished mentors are hidden from mentees,
* admin can unpublish a mentor anytime.

---

## 6.9 External Feedback Collection

PISE should collect simple feedback after mentorship sessions through an external form such as Google Form or Tally.

The portal should provide access to the external feedback form link.

The portal should not build an in-app feedback form or feedback response management in MVP.

External feedback form should collect:

* respondent role,
* mentor name,
* mentee name or email,
* session date,
* whether the session happened,
* rating,
* what was helpful,
* what can be improved,
* and whether follow-up is needed.

Acceptance criteria:

* mentee or mentor can access the external feedback form link,
* feedback form opens outside the portal,
* portal does not store feedback responses,
* PISE can review feedback responses in the external tool.

---

## 7. Non-Goals

Do not build the following in MVP:

* native booking system,
* native availability management,
* Google Calendar integration,
* Google Meet integration,
* Calendly API integration,
* Calendly webhook integration,
* automated booking sync,
* automated attendance tracking,
* automated availability checking,
* automated reminder system,
* in-app feedback form,
* feedback database,
* feedback admin review,
* in-app chat,
* AI mentor matching,
* payment,
* public signup,
* complex analytics dashboard,
* complex multi-cohort management,
* advanced mentor search,
* mentor ranking,
* language filter as a required MVP filter,
* complex recommendation logic,
* multi-role permission model.

If implementation requires one of these, stop and simplify the solution.

---

## 8. Core Product Rules

## Rule 1 — Booking happens outside PISE

The PISE portal must not create, confirm, reschedule, or cancel bookings.

All booking actions happen through Calendly.

## Rule 2 — Access is invite-only

The portal must not allow public signup.

Only approved active users can log in.

## Rule 3 — Only published mentors are visible to mentees

Mentees should only see mentors that admin has published.

Unpublished mentors are hidden from mentees.

## Rule 4 — Mentor must have a valid Calendly link to be bookable

A mentor should not be shown as bookable without a valid Calendly URL.

## Rule 5 — Mentors own their profile content

Mentors should be able to complete and maintain their own profile content.

Admin should not be the bottleneck for every profile content update.

## Rule 6 — Mentors can update their own Calendly link

Mentors can update their own Calendly booking link directly from their profile management page.

This prevents PISE from becoming the bottleneck every time a mentor changes schedule.

## Rule 7 — Admin controls publishing

Mentors can edit their own profile content, but mentors cannot publish themselves.

Admin controls whether the mentor profile is visible to mentees.

## Rule 8 — Keep implementation simple

Prefer simple implementation over automation.

Do not add integrations or complex logic unless explicitly required.

## Rule 9 — Preserve PISE brand feeling

The portal should feel connected to PISE: warm, youth-led, community-driven, and impact-oriented.

UI details should follow the design system document.

## Rule 10 — Mentor discovery must stay simple

The portal should help mentees discover mentors through clear profile attributes such as location, disciplines, and industries.

Do not build complex matching, ranking, or recommendation logic in MVP.

The goal is to make mentor discovery easier and clearer, not to automate mentor selection.

---

## 9. Primary User Flows

## 9.1 Mentee Flow

1. Mentee logs in with approved email.
2. Mentee lands on the home page.
3. Mentee opens mentor list.
4. Mentee filters mentors.
5. Mentee opens mentor profile.
6. Mentee reads mentor information.
7. Mentee clicks `Book via Calendly`.
8. Mentee completes booking on Calendly.
9. Mentee accesses external feedback form after the session.

## 9.2 Mentor Flow

1. Mentor logs in with approved email.
2. Mentor opens own profile management page.
3. Mentor completes or updates profile content.
4. Mentor updates Calendly link if needed.
5. Mentor saves changes.
6. Mentor sees profile readiness or published status.
7. Admin publishes the profile when ready.
8. Mentor manages actual availability and bookings in Calendly.

## 9.3 Admin Flow

1. Admin logs in.
2. Admin creates mentor profile shell.
3. Admin links profile to mentor user if available.
4. Mentor completes or updates profile content.
5. Admin reviews required profile information.
6. Admin tests Calendly link manually.
7. Admin publishes mentor when ready.
8. Admin unpublishes mentor if profile, link, or readiness is no longer valid.

---

## 10. MVP Success Definition

The MVP is successful when:

* approved active users can log in,
* unapproved or inactive users cannot access the portal,
* mentees can browse published mentors,
* mentees can filter mentors,
* mentees can view mentor profiles,
* mentees can book through Calendly,
* mentors can complete and maintain their own profile content,
* mentors can update their own Calendly link,
* admins can create mentor profile shells,
* admins can review and publish mentor profiles,
* unpublished mentors are hidden from mentees,
* external feedback form link is available,
* and PISE can operate the program without native booking infrastructure.

---

## 11. Key Metrics

Keep metrics simple.

Readiness metrics:

* number of mentor profiles created,
* number of mentor profiles completed by mentors,
* number of published mentors,
* number of mentors with valid Calendly links,
* number of incomplete mentor profiles.

Usage metrics:

* number of mentees who log in,
* number of mentor list views,
* number of mentor profile views,
* number of Calendly link clicks.

Feedback metrics:

* number of feedback responses in external form,
* number of completed sessions reported,
* average session rating,
* number of issues requiring follow-up.

---

## 12. AI Coding Instructions

When using this PRD for vibe coding:

1. Keep the product simple.
2. Do not build native booking logic.
3. Do not add Calendly API or webhook integration.
4. Do not add Google Calendar or Google Meet integration.
5. Do not build public signup.
6. Do not build in-app feedback.
7. Do not build features outside MVP scope.
8. Build in small, reviewable steps.
9. Prefer simple CRUD and clear UI over automation.
10. Mentor should own profile content.
11. Admin should own publishing control.
12. Before building UI, follow the design system document.
13. If there is a conflict, follow the core product rules in this PRD.

---

## 13. Final MVP Statement

The PISE Mentorship Portal MVP is a private mentor discovery and booking access platform.

It helps approved mentees find suitable mentors, understand mentor fit, and book through each mentor’s own Calendly link.

It helps mentors complete and maintain their own profile content and booking link.

It helps PISE admins review mentor readiness and control which mentors are visible to mentees.

The MVP should stay simple, avoid complex scheduling infrastructure, and focus on helping mentorship sessions happen with better preparation and better mentor fit.
