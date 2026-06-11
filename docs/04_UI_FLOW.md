# 04_UI_FLOW.md — PISE Mentorship Portal MVP

## 1. Purpose

This document defines the UI flow and screen behavior for the PISE Mentorship Portal MVP.

Use this document after reading:

```text
01_PRD.md
02_MVP_FUNCTIONAL_SPEC.md
03_DATA_MODEL.md
```

This document is optimized for AI-assisted coding with Claude Code.

The goal is to build a simple private portal where:

* approved users can log in,
* mentees can browse and filter mentors,
* mentees can understand mentor fit before booking,
* mentees can book through Calendly,
* mentors can complete and maintain their own profile,
* admins can create unpublished mentor profile drafts,
* admins can review mentor readiness,
* admins can publish or unpublish mentor profiles,
* users can access an external feedback form link.

Do not build native booking, in-app chat, AI matching, advanced analytics, admin user management UI, support-area filtering, image upload, or in-app feedback submission.

---

## 2. UI Design Principles

The UI should be:

* simple,
* warm,
* readable,
* mobile-friendly,
* easy to scan,
* aligned with PISE’s youth/community brand,
* optimized for fast implementation.

Prioritize:

* clear mentor cards,
* simple filters,
* clear mentor profile sections,
* obvious Calendly CTA,
* straightforward mentor profile form,
* simple admin review/publish flow.

Avoid:

* complex dashboards,
* deep nested navigation,
* heavy animations,
* booking calendar UI,
* recommendation UI,
* admin analytics,
* feedback management UI,
* profile approval workflow beyond publish/unpublish.

---

## 3. Required Routes

Build only these MVP routes:

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

Do not build these routes unless explicitly requested:

```text
/feedback
/admin/users
/admin/analytics
/admin/feedback
/admin/filter-options
```

Notes:

* Feedback is an external link, not an app route.
* Approved users can be managed directly in Supabase for MVP.
* Filter options can be seeded or updated directly in Supabase for MVP.

---

## 4. Global App Shell

## 4.1 Header

All authenticated pages should have a simple header.

Header content:

* PISE logo or wordmark,
* main navigation,
* current user role label if easy,
* logout action.

## 4.2 Navigation by Role

### Mentee Navigation

Show:

* Home,
* Mentors,
* Feedback link if configured.

### Mentor Navigation

Show:

* Home,
* Mentors,
* My Profile,
* Feedback link if configured.

### Admin Navigation

Show:

* Home,
* Mentors,
* Admin,
* Feedback link if configured.

Do not build a complex sidebar for MVP.

## 4.3 Feedback Link

The feedback link should open the external feedback form in a new tab.

Behavior:

```text
Click “Submit session feedback”
→ open external feedback form in new tab
```

If the feedback URL is missing:

* hide the feedback link, or
* show a simple unavailable message.

Do not build `/feedback`.

## 4.4 Mobile Navigation

Use a simple responsive header.

On mobile:

* nav links can wrap,
* nav links can stack,
* or use a basic menu if already available from the UI library.

Do not spend time building a custom complex hamburger menu.

---

## 5. End-to-End User Flows

## 5.1 Mentee Flow

```text
Login
→ Home
→ Mentor List
→ Apply filters
→ Open Mentor Profile
→ Read mentor fit
→ Click Book via Calendly
→ Calendly opens in new tab
→ After session, open external feedback form
```

## 5.2 Mentor Flow

```text
Login
→ Home
→ My Profile
→ Complete or update profile content
→ Add or update Calendly URL
→ Save
→ See completeness and publish status
→ Wait for admin to publish if unpublished
```

If mentor has no linked profile:

```text
Login
→ My Profile
→ Empty state: contact PISE team
```

## 5.3 Admin Flow

```text
Login
→ Admin
→ Mentor Management
→ Create unpublished mentor profile draft
→ Link draft to mentor user if available
→ Mentor completes profile
→ Admin reviews completeness
→ Admin publishes mentor
```

If profile is incomplete:

```text
Publish
→ Validation error
→ Show missing fields
→ Keep mentor unpublished
```

---

## 6. Screen: Login

## 6.1 Purpose

Allow approved users to request magic link login.

## 6.2 UI Components

* PISE logo or wordmark,
* short product description,
* email input,
* `Send login link` button,
* invite-only helper text.

## 6.3 Suggested Copy

Title:

```text
Welcome to PISE Mentorship Portal
```

Description:

```text
Sign in with your approved email to explore mentors and manage your mentorship journey.
```

Helper text:

```text
This portal is only available for approved PISE mentors, mentees, and team members.
```

Button:

```text
Send login link
```

## 6.4 States

### Invalid Email

```text
Please enter a valid email address.
```

### Email Submitted

```text
Check your inbox for the login link.
```

### Unapproved Email

```text
This email is not approved for access. Please contact the PISE team if you believe this is a mistake.
```

### Inactive User

```text
Your access is currently inactive. Please contact the PISE team for support.
```

## 6.5 Acceptance Criteria

* user can enter email,
* valid approved email can request magic link,
* invalid email shows validation error,
* unapproved email is blocked,
* inactive user is blocked,
* UI works on desktop and mobile.

---

## 7. Screen: Access Denied

## 7.1 Purpose

Explain that the portal is private.

## 7.2 UI Components

* simple message card,
* link back to login.

## 7.3 Suggested Copy

```text
This portal is currently available only for approved PISE mentors and mentees.
If you believe you should have access, please contact the PISE team.
```

Button:

```text
Back to login
```

## 7.4 Acceptance Criteria

* unapproved users cannot access protected pages,
* inactive users cannot access protected pages,
* message is clear and non-technical,
* no internal admin details are exposed.

---

## 8. Screen: Home

## 8.1 Purpose

Help users understand where to go next.

Keep this page simple.

Do not build a dashboard.

---

## 8.2 Mentee Home

Show:

* welcome message,
* short explanation of the portal,
* simple steps:

  1. Browse mentors,
  2. Open mentor profile,
  3. Prepare questions,
  4. Book via Calendly,
* CTA to mentor list,
* external feedback form link if configured.

Suggested title:

```text
Find the right mentor for your next step
```

Suggested description:

```text
Browse PISE mentors by location, discipline, and industry. Open a mentor profile to understand what they can help with before booking.
```

Primary CTA:

```text
Browse mentors
```

Secondary link:

```text
Submit session feedback
```

---

## 8.3 Mentor Home

Show:

* welcome message,
* profile status summary,
* CTA to profile management page,
* reminder to keep profile and Calendly link updated,
* external feedback form link if configured.

Suggested title:

```text
Keep your mentor profile ready
```

Suggested description:

```text
Complete your profile so mentees can understand your background, what you can help with, and how to book time with you.
```

Primary CTA:

```text
Update my mentor profile
```

Profile status summary should show:

* Published or Unpublished,
* Complete or Incomplete,
* missing required fields if incomplete.

Do not allow publishing from mentor home.

---

## 8.4 Admin Home

Show simple shortcut cards:

* Manage mentors,
* Open mentor list.

Optional if easy:

* external feedback form link.

Suggested title:

```text
Manage the PISE mentorship portal
```

Suggested description:

```text
Review mentor readiness and control which mentor profiles are visible to mentees.
```

Do not build:

* metrics widgets,
* analytics dashboard,
* feedback dashboard,
* user management dashboard.

## 8.5 Acceptance Criteria

* mentee can navigate to mentor list,
* mentor can navigate to own profile management,
* admin can navigate to mentor management,
* feedback link is accessible if configured,
* page works on mobile.

---

## 9. Screen: Mentor List

## 9.1 Purpose

Help mentees browse and discover mentors.

This screen is the main discovery experience.

## 9.2 Layout

Recommended desktop layout:

```text
Page title + helper text
Filter section
Mentor card grid
```

Recommended mobile layout:

```text
Page title + helper text
Filter section stacked
Mentor cards stacked vertically
```

## 9.3 Page Header

Title:

```text
Find a mentor
```

Helper text:

```text
Browse mentors by location, discipline, and industry. Open a profile to learn what each mentor can help with before booking.
```

## 9.4 Filter Section

Required filter groups:

* Location,
* Disciplines,
* Industries.

Do not build support area filter in MVP.

Support areas should be displayed as tags only.

Recommended filter UI:

* grouped filter chips,
* selected chips clearly highlighted,
* `Clear all` action.

## 9.5 Filter Behavior

* user can select multiple values in one group,
* OR logic within same group,
* AND logic across different groups,
* user can clear one selected filter,
* user can clear all filters.

Example:

```text
Location: Ho Chi Minh City OR Remote / Online
Discipline: Product Management
Industry: SaaS OR Education

Result:
Mentors matching selected location AND selected discipline AND selected industry.
```

## 9.6 Mentor Card

Each mentor card should show:

* photo/avatar,
* name,
* current role/title,
* location tags,
* discipline tags,
* industry tags,
* support area tags if available,
* short bio or short description,
* `View Profile` button.

Recommended card CTA:

```text
View Profile
```

Do not make Calendly booking the primary action on the card.

Booking should happen from the mentor profile page after the mentee understands mentor fit.

## 9.7 Mentor Card States

### Missing Photo

Show initials or default avatar.

Do not build image upload.

### Long Text

Truncate long bio after 2–3 lines.

### Too Many Tags

Show the most relevant tags and allow wrapping if simple.

Do not overbuild tag truncation logic.

## 9.8 Empty States

### No Published Mentors

```text
No mentors are available yet.
Please check back later.
```

### No Filter Results

```text
No mentors match your current filters.
Try removing one filter or browsing all mentors.
```

Button:

```text
Clear filters
```

## 9.9 Acceptance Criteria

* only published mentors are visible to mentees,
* mentor card communicates fit clearly,
* filters work correctly,
* empty state appears when needed,
* user can open mentor profile,
* layout works on desktop and mobile.

---

## 10. Screen: Mentor Profile

## 10.1 Purpose

Help mentees decide whether a mentor is a good fit before booking.

## 10.2 Layout

Recommended layout:

```text
Mentor header
Profile sections
Booking CTA
Feedback link/instruction
```

## 10.3 Mentor Header

Show:

* photo/avatar,
* name,
* current role/title,
* location tags,
* discipline tags,
* industry tags,
* primary CTA: `Book via Calendly`.

## 10.4 Main Sections

Use clear section headings:

```text
About this mentor
What I can help with
Good fit for
Suggested topics to ask
Booking instructions
```

## 10.5 Booking CTA

Primary CTA:

```text
Book via Calendly
```

Behavior:

* opens Calendly URL in a new tab,
* does not create booking inside portal,
* does not show internal booking confirmation,
* does not track attendance.

Place CTA:

* near top of profile,
* again near bottom of profile.

## 10.6 Feedback Link

Show lightweight post-session instruction:

```text
After your session, please submit feedback so PISE can improve the mentorship experience.
```

Link label:

```text
Submit session feedback
```

Behavior:

* opens external feedback form in new tab.

Do not build in-app feedback form.

## 10.7 Missing Calendly URL

Published mentors should normally have a valid Calendly URL.

If somehow missing:

* hide booking CTA,
* show simple message:

```text
Booking is temporarily unavailable for this mentor.
```

Do not show technical details.

## 10.8 Acceptance Criteria

* mentee can understand mentor background,
* mentee can understand what mentor can help with,
* mentee can decide whether mentor is relevant,
* Calendly CTA opens external link,
* feedback link opens external form,
* page works on desktop and mobile.

---

## 11. Screen: Mentor Profile Management

## 11.1 Purpose

Allow mentors to complete and maintain their own mentor profile.

This page replaces the old “Mentor Settings” concept.

Mentor should be able to maintain profile content, not only Calendly link.

## 11.2 Access

Only mentor users can access this page.

A mentor can only edit their own linked mentor profile.

Admins should use admin mentor edit page, not this page.

Mentees cannot access this page.

## 11.3 Layout

Recommended layout:

```text
Page title
Profile status card
Profile form
Booking section
Save button
Status messages
```

## 11.4 Page Title

```text
My mentor profile
```

## 11.5 Profile Status Card

Show:

* Published or Unpublished,
* Complete or Incomplete,
* missing required fields if incomplete,
* short explanation that admin controls publishing.

Suggested unpublished message:

```text
Your profile is not published yet. PISE admin will publish it after review.
```

Suggested incomplete message:

```text
Complete the required fields so PISE can review and publish your profile.
```

Do not show a publish button to mentors.

## 11.6 Editable Sections

### Basic Information

Mentor can edit:

* photo/avatar URL,
* current role/title,
* short bio.

Name should be read-only unless PISE explicitly allows mentors to change display name.

Slug should always be read-only for mentors.

Do not build image upload. Use photo URL text input only.

### Discovery Attributes

Mentor can edit:

* location,
* disciplines,
* industries,
* support areas.

Use filter options from database or static config.

Support areas are editable profile tags but not used as mentee-facing filters in MVP.

### Profile Content

Mentor can edit:

* what this mentor can help with,
* suitable mentee profile,
* suggested topics mentees can ask about.

### Booking Information

Mentor can edit:

* Calendly URL,
* booking instruction.

## 11.7 Non-Editable Fields for Mentor

Mentor cannot edit:

* published status,
* linked user account,
* slug,
* admin-only fields,
* another mentor’s profile.

## 11.8 Required Fields for Completeness

A profile is complete when these fields exist:

* name,
* current role/title,
* short bio,
* at least one location,
* at least one discipline,
* at least one industry,
* what this mentor can help with,
* valid Calendly URL starting with `https://`.

Optional fields:

* photo/avatar URL,
* support areas,
* suitable mentee profile,
* suggested topics,
* booking instruction.

## 11.9 Calendly URL Validation

Calendly URL must:

* be valid URL format,
* start with `https://`.

If URL does not contain `calendly.com`, show warning:

```text
This link does not look like a standard Calendly URL. Please double-check before saving.
```

If invalid:

```text
Please enter a valid URL starting with https://.
```

Do not verify Calendly availability.

## 11.10 Save Behavior

On save:

* validate allowed fields,
* validate URL format if provided,
* save profile content,
* update `updated_at`,
* if Calendly URL changed:

  * update `calendly_url_updated_at`,
  * update `calendly_url_updated_by`,
* show success message.

Success message:

```text
Your mentor profile has been updated.
```

Important:

* saving does not publish profile,
* admin still controls publish/unpublish.

## 11.11 No Linked Profile State

If mentor user has no linked mentor profile:

```text
Your mentor profile is not connected yet.
Please contact the PISE team for support.
```

## 11.12 Acceptance Criteria

* mentor can access own profile management page,
* mentor can update own profile content,
* mentor can update own Calendly link,
* mentor can see completeness status,
* mentor can see publish status,
* mentor cannot publish themselves,
* mentor cannot edit another mentor’s profile,
* invalid URL is blocked,
* non-standard Calendly URL shows warning,
* saved content appears on mentor profile according to publishing rules.

---

## 12. Screen: Admin Home

## 12.1 Purpose

Give admins simple shortcuts.

Do not build a full dashboard.

## 12.2 UI Components

Shortcut cards:

* Manage mentors,
* Open mentor list.

Optional:

* Feedback form link.

## 12.3 Suggested Copy

Title:

```text
Admin
```

Description:

```text
Review mentor readiness and control which mentor profiles are visible to mentees.
```

## 12.4 Acceptance Criteria

* admin can access admin home,
* non-admin users cannot access admin home,
* admin can navigate to mentor management,
* admin can open mentor list.

---

## 13. Screen: Admin Mentor List

## 13.1 Purpose

Allow admins to manage mentor readiness and visibility.

This is not a full admin dashboard.

## 13.2 Layout

Recommended layout:

```text
Page title
Create mentor profile button
Mentor table or card list
```

## 13.3 Mentor List Fields

Show:

* mentor name,
* linked mentor user status,
* current role/title,
* profile completeness,
* Calendly URL status,
* published status,
* last updated date,
* actions.

Actions:

* Edit,
* Publish,
* Unpublish.

## 13.4 Status Labels

Linked user status:

```text
Linked
Not linked
```

Profile completeness:

```text
Complete
Incomplete
```

Calendly status:

```text
Valid link
Missing link
Invalid link
Check link
```

Published status:

```text
Published
Unpublished
```

## 13.5 Empty State

```text
No mentor profiles have been created yet.
Create the first mentor profile to get started.
```

Button:

```text
Create mentor profile
```

## 13.6 Acceptance Criteria

* admin can view all mentor profiles,
* admin can see readiness status,
* admin can create mentor profile draft,
* admin can edit mentor profile,
* admin can publish/unpublish mentor,
* non-admin users cannot access this page.

---

## 14. Screen: Admin Create/Edit Mentor

## 14.1 Purpose

Allow admins to create unpublished mentor profile drafts and review mentor profiles before publishing.

Admin can also edit or override profile content when needed.

## 14.2 Create Mentor Profile Draft

Admin can create a draft with minimal information.

Required for draft creation:

* mentor name,
* slug.

Optional for draft creation:

* linked mentor user,
* current role/title,
* Calendly URL,
* other profile fields.

Default:

```text
is_published = false
```

Use copy:

```text
Create mentor profile draft
```

Use the phrase “mentor profile draft” in UI.

## 14.3 Form Sections

Use simple grouped sections.

### Admin / Linkage

Fields:

* linked mentor user, optional,
* slug,
* published status display.

Slug is admin-controlled.

### Basic Information

Fields:

* name,
* photo URL,
* current role/title,
* short bio.

Use photo URL text input only.

Do not build image upload.

### Discovery Attributes

Fields:

* location,
* disciplines,
* industries,
* support areas.

Use filter options from data model.

Support areas are tags only, not filters in MVP.

### Profile Content

Fields:

* what this mentor can help with,
* suitable mentee profile,
* suggested topics.

### Booking Information

Fields:

* Calendly URL,
* booking instruction.

### Publishing

Actions:

* Save draft,
* Publish,
* Unpublish.

## 14.4 Save Draft Behavior

Admin can save incomplete profile as unpublished.

Save draft:

* saves entered fields,
* does not require all publish-required fields,
* keeps profile unpublished unless already published and admin is only editing non-critical fields.

For simplicity, if admin edits a published mentor and removes required fields, the app should either:

* block saving, or
* save and automatically unpublish.

Recommended MVP behavior:

```text
Block saving changes that would make a published mentor incomplete.
```

## 14.5 Required Fields for Publishing

To publish, required:

* name,
* slug,
* current role/title,
* short bio,
* at least one location,
* at least one discipline,
* at least one industry,
* what this mentor can help with,
* valid Calendly URL starting with `https://`.

## 14.6 Publish Validation

If admin tries to publish incomplete profile, block publish.

Example message:

```text
Cannot publish this mentor yet. Missing: discipline, Calendly URL.
```

If URL does not look like Calendly:

```text
This booking link does not look like a standard Calendly URL. Please double-check it before publishing.
```

## 14.7 Publish Behavior

Publish behavior:

* validate required fields,
* if valid, set `is_published = true`,
* if invalid, keep unpublished and show missing fields.

## 14.8 Unpublish Behavior

Unpublish behavior:

* set `is_published = false`,
* hide mentor from mentee mentor list,
* keep profile editable by mentor owner and admin.

## 14.9 Acceptance Criteria

* admin can create mentor profile draft,
* draft can be incomplete and unpublished,
* admin can link mentor profile to mentor user,
* admin can edit mentor profile,
* admin can review completeness,
* admin can publish complete profile,
* admin cannot publish incomplete profile,
* admin can unpublish anytime,
* unpublished mentor is hidden from mentees,
* mentor owner can still edit own unpublished profile.

---

## 15. Feedback Link Behavior

## 15.1 Purpose

Allow users to access the external feedback form.

## 15.2 UI Locations

Show feedback link in:

* Home page,
* Mentor profile page,
* Navigation/footer if simple.

## 15.3 Behavior

* feedback link opens external form in new tab,
* portal does not store feedback,
* portal does not show feedback response list,
* portal does not build feedback admin screen.

## 15.4 Missing Feedback URL

If feedback form URL is missing:

* hide feedback link, or
* show:

```text
Feedback form is not available yet.
```

## 15.5 Acceptance Criteria

* users can open external feedback form,
* no in-app feedback form is built,
* no feedback response database is needed.

---

## 16. Reusable UI Components

Create simple reusable components only when useful.

Required components:

```text
AppHeader
PageHeader
EmptyState
LoadingState
ErrorMessage
MentorCard
MentorTag
FilterGroup
CalendlyButton
FeedbackLink
ProfileStatusCard
AdminStatusBadge
```

Optional components if they reduce duplication:

```text
WarningMessage
MentorProfileForm
AdminMentorForm
```

Do not over-abstract.

Do not create a large design system inside this MVP.

Do not create `UserForm` unless admin user management UI is explicitly requested.

---

## 17. UI State Checklist

Each main screen should handle:

* loading,
* empty state,
* error state,
* unauthorized access,
* mobile layout.

Required states by screen:

| Screen                    | Loading | Empty | Error | Unauthorized |
| ------------------------- | ------: | ----: | ----: | -----------: |
| Login                     |     Yes |    No |   Yes |           No |
| Home                      |     Yes |    No |   Yes |          Yes |
| Mentor List               |     Yes |   Yes |   Yes |          Yes |
| Mentor Profile            |     Yes |   Yes |   Yes |          Yes |
| Mentor Profile Management |     Yes |   Yes |   Yes |          Yes |
| Admin Mentor List         |     Yes |   Yes |   Yes |          Yes |
| Admin Mentor Form         |     Yes |    No |   Yes |          Yes |

---

## 18. Mobile Rules

The portal must work well on mobile.

Mobile behavior:

* mentor cards stack vertically,
* filters stack vertically,
* form sections stack vertically,
* buttons are easy to tap,
* profile sections stack vertically,
* admin mentor table can become cards if table is hard to read.

Do not spend excessive time on advanced responsive behavior.

Keep it simple and readable.

---

## 19. UI Flow Completion Checklist

The UI flow is complete when:

* login page works for invite-only access,
* access denied page is clear,
* home page has role-appropriate CTAs,
* mentees can browse mentor list,
* mentees can apply and clear location/discipline/industry filters,
* mentor cards are scannable,
* mentor profile explains fit before booking,
* Calendly CTA opens external link,
* mentor can manage own profile content,
* mentor can update own Calendly link,
* mentor can see completeness and publish status,
* mentor cannot publish themselves,
* admin can create unpublished mentor profile draft,
* admin can link mentor profile to mentor user,
* admin can review mentor completeness,
* admin can publish/unpublish mentors,
* external feedback link is available,
* no native booking UI is built,
* no in-app feedback UI is built,
* no admin user management UI is built,
* no support area filter is built,
* no image upload is built,
* UI works on desktop and mobile.

## Design System Reference

This file defines UI flow and screen behavior only.

For visual design, component styling, spacing, typography, colors, and brand expression, follow:

07_DESIGN_SYSTEM.md

Do not invent a separate visual style inside individual screens.
All pages should reuse the same design patterns from the design system.