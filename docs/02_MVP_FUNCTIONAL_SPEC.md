# 02_MVP_FUNCTIONAL_SPEC.md — PISE Mentorship Portal MVP

## 1. Purpose

This document defines the functional behavior of the PISE Mentorship Portal MVP.

Use this document after reading `01_PRD.md`.

This spec is written for AI-assisted coding. It should help Claude Code or any AI coding agent understand:

* which roles exist,
* which pages to build,
* what each user can do,
* what fields are needed,
* what validation is required,
* what states must be handled,
* and what must stay out of scope.

This spec should stay practical and implementation-ready. Do not introduce future phases, complex automation, or integrations outside the MVP.

---

## 2. Product Boundary

The PISE Mentorship Portal is a private mentor discovery and booking access platform.

The portal helps approved mentees:

* browse published mentors,
* filter mentors by simple profile attributes,
* understand mentor fit,
* open mentor profiles,
* prepare before booking,
* and book through each mentor’s own Calendly link.

The portal helps mentors:

* complete their own mentor profile,
* maintain their own mentor profile content,
* explain what they can help with,
* update their own Calendly link,
* and manage their actual availability in Calendly.

The portal helps admins:

* create mentor profile shells,
* link mentor profiles to mentor users,
* review mentor readiness,
* publish or unpublish mentors,
* and maintain portal quality.

The portal does not create or manage bookings.

Calendly handles:

* mentor availability,
* time slot selection,
* booking confirmation,
* calendar invite,
* meeting link,
* reminder emails,
* rescheduling,
* and cancellation.

External form tool handles:

* post-session feedback collection.

The PISE portal handles:

* invite-only access,
* mentor discovery,
* mentor profile display,
* mentor filtering,
* mentor profile self-management,
* Calendly link access,
* admin publishing control,
* and external feedback form access.

---

## 3. User Roles and Permissions

## 3.1 Roles

The MVP supports three roles:

* `mentee`
* `mentor`
* `admin`

For MVP, each user should have one primary role only.

Do not implement multi-role permissions unless explicitly requested.

If an admin is also a mentor, the admin can manage that mentor profile through admin mentor management.

---

## 3.2 Permission Matrix

| Capability                              | Mentee | Mentor |                   Admin |
| --------------------------------------- | -----: | -----: | ----------------------: |
| Log in if approved                      |    Yes |    Yes |                     Yes |
| View home page                          |    Yes |    Yes |                     Yes |
| View mentor list                        |    Yes |    Yes |                     Yes |
| View published mentor profiles          |    Yes |    Yes |                     Yes |
| Open Calendly booking link              |    Yes |    Yes |                     Yes |
| Access external feedback form link      |    Yes |    Yes |                     Yes |
| View own mentor profile management page |     No |    Yes | No, use admin edit page |
| Edit own mentor profile content         |     No |    Yes |                     Yes |
| Update own Calendly link                |     No |    Yes |                     Yes |
| Create mentor profile shell             |     No |     No |                     Yes |
| Link mentor profile to mentor user      |     No |     No |                     Yes |
| Publish/unpublish mentor                |     No |     No |                     Yes |
| View unpublished own mentor profile     |     No |    Yes |                     Yes |
| View all unpublished mentor profiles    |     No |     No |                     Yes |
| Manage feedback responses in app        |     No |     No |                      No |

---

## 3.3 Access Rules

* Public signup is not allowed.
* Only approved active users can log in.
* Unapproved users must not access portal content.
* Inactive users must not access portal content.
* Admin-only pages must be protected from mentee and mentor access.
* Mentor profile management page must only be accessible by the mentor owner.
* Mentees cannot access mentor profile management or admin pages.
* Mentors cannot publish or unpublish themselves.

---

## 4. Route and Page Structure

## 4.1 Required Routes

Recommended MVP routes:

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

## 4.2 Routes Not Required for MVP

Do not build these routes unless explicitly requested:

```text
/feedback
/admin/users
/admin/analytics
/admin/feedback
```

Approved users can be managed directly in Supabase or seed data for MVP.

Feedback should be handled through an external form link, not an in-app route.

---

## 4.3 Route Behavior

* `/login` is public.
* `/access-denied` is public.
* All other app routes require approved active login.
* `/admin/*` requires admin role.
* `/mentor/profile` requires mentor role and linked mentor profile.
* `/mentors` and `/mentors/[slug]` are accessible to approved active users.
* Unapproved or inactive users should see `/access-denied`.

---

## 5. Global Functional Rules

## 5.1 Invite-Only Rule

Only approved active users can access the portal.

Functional behavior:

1. User enters email.
2. System checks whether the email exists in the approved user list.
3. If approved and active, user can continue login.
4. If not approved or inactive, show access denied message.
5. Do not create public access for unknown emails.

## 5.2 Published Mentor Rule

Mentees only see mentors that are published.

A mentor is visible to mentees only when:

* `is_published = true`
* required profile fields are complete
* Calendly URL has valid URL format

## 5.3 Booking Rule

The portal must not create, edit, confirm, reschedule, or cancel bookings.

Booking CTA always opens the mentor’s Calendly URL.

## 5.4 Mentor Profile Ownership Rule

Mentors own their profile content.

A mentor can edit their own profile content, including:

* role/title,
* bio,
* discovery attributes,
* support description,
* suitable mentee profile,
* suggested topics,
* booking instruction,
* Calendly URL.

Mentors cannot edit:

* publish status,
* linked user account,
* admin-only fields,
* another mentor’s profile.

## 5.5 Admin Publishing Rule

Admin controls publishing.

Admin can:

* create mentor profile shell,
* review mentor completeness,
* publish mentor,
* unpublish mentor,
* override mentor profile content if needed.

Mentors cannot publish themselves.

## 5.6 Simple Discovery Rule

Mentor discovery is based on clear profile attributes:

* location,
* disciplines,
* industries,
* support areas as display tags.

Do not build:

* ranking,
* recommendation algorithm,
* AI matching,
* advanced search,
* scoring logic.

## 5.7 External Feedback Rule

For MVP, feedback should be collected through an external form link such as Google Form or Tally.

Do not build:

* in-app feedback submission,
* feedback database,
* admin feedback review screen.

---

## 6. Authentication and Access

## 6.1 Login Page

Purpose:

Allow approved users to log in.

Recommended login method:

* email magic link.

UI elements:

* PISE logo or wordmark,
* short portal explanation,
* email input,
* `Send login link` button,
* helper text explaining invite-only access.

Validation:

* email is required,
* email must be valid format.

States:

* empty input,
* invalid email format,
* email submitted,
* magic link sent,
* unapproved email,
* inactive user,
* login error.

Acceptance criteria:

* approved active user can request login link,
* unapproved email receives clear access-denied message,
* inactive user cannot access the portal,
* user cannot bypass approval check,
* page works on mobile and desktop.

---

## 6.2 Access Denied Page

Purpose:

Explain that the portal is private.

Message:

```text
This portal is currently available only for approved PISE mentors and mentees.
If you believe you should have access, please contact the PISE team.
```

Acceptance criteria:

* unapproved users cannot access portal pages,
* inactive users cannot access portal pages,
* message does not expose internal admin details.

---

## 7. Home Page

## 7.1 Purpose

The home page helps users understand what the portal is for and where to go next.

Keep this page simple. Do not build a dashboard.

---

## 7.2 Mentee Home Content

Show:

* welcome message,
* short explanation of the mentorship portal,
* how to browse mentors,
* reminder to prepare before booking,
* CTA to browse mentors,
* external feedback form link.

Recommended CTA:

```text
Browse mentors
```

Recommended preparation reminder:

```text
Before booking, prepare a few questions and a short context about what you want to discuss. This helps your mentor support you better.
```

Acceptance criteria:

* mentee can navigate to mentor list,
* feedback link is visible if configured,
* page works on mobile and desktop.

---

## 7.3 Mentor Home Content

Show:

* welcome message,
* profile status summary,
* CTA to mentor profile management,
* reminder to keep profile and Calendly link updated,
* short explanation that availability and bookings are managed in Calendly,
* external feedback form link.

Recommended CTA:

```text
Update my mentor profile
```

Profile status should show:

* Published or Unpublished,
* Complete or Incomplete,
* missing required fields if incomplete.

Acceptance criteria:

* mentor can navigate to own profile management page,
* mentor can understand whether their profile is complete,
* mentor can understand whether their profile is published,
* page works on mobile and desktop.

---

## 7.4 Admin Home Content

Show simple admin shortcuts:

* Manage mentors,
* Open mentor list,
* External feedback form link if configured.

Do not build:

* analytics dashboard,
* session dashboard,
* feedback dashboard.

Acceptance criteria:

* admin can navigate to mentor management,
* admin can open mentor list,
* page works on mobile and desktop.

---

## 8. Mentor Browsing Page

## 8.1 Purpose

The mentor browsing page helps mentees find relevant mentors quickly.

The page should not feel like a generic flat list. Each mentor card should communicate mentor fit clearly.

---

## 8.2 Page Content

The page should include:

* page title,
* short guidance text,
* filter section,
* mentor card grid/list,
* empty state when no mentors match,
* loading state while data loads.

Recommended title:

```text
Find a mentor
```

Recommended helper text:

```text
Browse mentors by location, discipline, and industry. Open a profile to learn what each mentor can help with before booking.
```

---

## 8.3 Mentor Card Fields

Each mentor card should show:

* mentor photo/avatar,
* mentor name,
* current role or short title,
* location,
* key disciplines,
* key industries,
* support area tags,
* short description,
* `View Profile` button.

Recommended MVP behavior:

* main CTA on card: `View Profile`,
* booking CTA should be emphasized on the mentor profile page, not the card.

Do not make Calendly booking the primary action on the mentor card.

---

## 8.4 Mentor Card Rules

* Show only published mentors to mentees.
* Do not show unpublished mentors.
* Do not show bookable CTA if Calendly URL is missing or invalid.
* Keep card text short.
* Do not show full bio on card.
* Show only key tags to avoid visual clutter.
* If photo is missing, show default avatar or initials.

---

## 8.5 Empty State

When no mentor matches filters, show:

```text
No mentors match your current filters.
Try removing one filter or browsing all mentors.
```

Include action:

```text
Clear filters
```

When there are no published mentors, show:

```text
No mentors are available yet.
Please check back later.
```

---

## 8.6 Acceptance Criteria

* mentees can view all published mentors,
* mentor cards clearly communicate mentor fit,
* mentees can open mentor detail page,
* unpublished mentors are hidden,
* mentors without valid Calendly link are not shown as bookable,
* browsing works on desktop and mobile.

---

## 9. Mentor Filters

## 9.1 Purpose

Filters help mentees narrow down mentors using simple, practical categories.

---

## 9.2 Required Filter Groups

The MVP must support:

* location,
* disciplines,
* industries.

Support areas should be shown as tags on cards and profiles.

Do not build support area filtering in MVP unless explicitly requested.

Do not build language filter in MVP.

---

## 9.3 Location

Location helps mentees understand geography, timezone, or local context.

Location should not block online mentorship.

Example values:

* Ho Chi Minh City,
* Hanoi,
* Vietnam,
* Singapore,
* United States,
* Remote / Online.

---

## 9.4 Disciplines

Disciplines describe the mentor’s professional or skill-based focus areas.

A mentor can have multiple disciplines.

Example values:

* Product Management,
* UX Research,
* UI/UX Design,
* Software Engineering,
* Data Analytics,
* Business Operations,
* Marketing,
* Finance,
* Leadership,
* Communication,
* Scholarship Preparation,
* Career Orientation.

---

## 9.5 Industries

Industries describe sectors or work environments where the mentor has experience.

A mentor can have multiple industries.

Example values:

* SaaS,
* Technology,
* Education,
* Non-profit / Community,
* Start-up,
* Corporate,
* Consulting,
* Finance / Investment,
* Healthcare,
* Manufacturing,
* E-commerce.

---

## 9.6 Filter Behavior

Functional rules:

* user can select one or more values in each filter group,
* user can select filters across multiple groups,
* mentor list updates based on selected filters,
* user can clear one filter,
* user can clear all filters,
* selected filters should be visually clear.

Matching rule:

* Within the same filter group, use OR logic.
* Across different filter groups, use AND logic.

Example:

```text
Selected:
Location = Ho Chi Minh City OR Remote / Online
Discipline = Product Management
Industry = SaaS OR Education

Result:
Show mentors who match one selected location AND Product Management AND one selected industry.
```

---

## 9.7 Maintainability Rule

Filter values should be maintainable without changing core product logic.

Implementation should use:

* database-backed filter options, or
* simple static config if faster for MVP.

Do not hardcode filter behavior in a way that requires code changes whenever PISE adds a new location, discipline, or industry.

---

## 9.8 Acceptance Criteria

* user can filter by location,
* user can filter by discipline,
* user can filter by industry,
* user can combine filters,
* user can clear filters,
* empty state appears when no result,
* filter values can be maintained without changing core product logic.

---

## 10. Mentor Profile Page

## 10.1 Purpose

The mentor profile page helps mentees decide whether the mentor is a good fit before booking.

---

## 10.2 Profile Fields

Show the following fields.

Basic information:

* name,
* photo/avatar,
* current role or title,
* short bio,
* location.

Discovery attributes:

* disciplines,
* industries,
* support areas / expertise tags,
* what this mentor can help with,
* suitable mentee profile.

Booking preparation:

* suggested topics mentees can ask about,
* booking instruction,
* Calendly booking CTA,
* external feedback form link or instruction.

---

## 10.3 Recommended Layout

Top section:

* photo/avatar,
* name,
* role/title,
* location,
* disciplines and industries,
* primary CTA: `Book via Calendly`.

Main content sections:

* About this mentor,
* What I can help with,
* Good fit for,
* Suggested topics to ask,
* Booking instructions.

Bottom section:

* repeat `Book via Calendly` CTA,
* show external feedback form link or post-session instruction.

---

## 10.4 Calendly CTA Behavior

CTA label:

```text
Book via Calendly
```

Behavior:

* opens Calendly URL in a new tab,
* does not create booking inside portal,
* does not require PISE booking confirmation.

If Calendly URL is invalid or missing:

* do not show booking CTA to mentee,
* show simple unavailable message if needed.

Message:

```text
Booking is temporarily unavailable for this mentor.
```

---

## 10.5 Acceptance Criteria

* mentee can understand mentor background,
* mentee can understand what mentor can help with,
* mentee can decide whether mentor is relevant before booking,
* mentee can open Calendly link,
* page works on desktop and mobile.

---

## 11. Mentor Profile Management Page

## 11.1 Purpose

Mentors can complete and maintain their own mentor profile.

This avoids making PISE admin the bottleneck for every profile update.

---

## 11.2 Access

Only users with role `mentor` can access their own mentor profile management page.

A mentor can only edit the mentor profile linked to their own user account.

Admins should edit mentor profiles through admin mentor management, not through mentor profile management.

Mentees cannot access this page.

---

## 11.3 Mentor Ownership Rule

Each mentor profile can be linked to one mentor user account.

A mentor can only update their own linked mentor profile.

If a mentor user has no linked mentor profile, show this empty state:

```text
Your mentor profile is not connected yet.
Please contact the PISE team for support.
```

Do not allow a mentor to edit another mentor’s profile.

---

## 11.4 Mentor Editable Fields

Mentor can edit:

* photo/avatar URL,
* current role or title,
* short bio,
* location,
* disciplines,
* industries,
* support areas / expertise tags,
* what this mentor can help with,
* suitable mentee profile,
* suggested topics mentees can ask about,
* booking instruction,
* Calendly booking URL.

Mentor cannot edit:

* published status,
* linked user account,
* admin-only fields,
* another mentor’s profile.

---

## 11.5 Profile Status Display

Mentor should see:

* Published or Unpublished,
* Complete or Incomplete,
* missing required fields if incomplete.

Mentor cannot change publish status.

Recommended copy if unpublished:

```text
Your profile is not published yet. PISE admin will publish it after review.
```

Recommended copy if incomplete:

```text
Complete the required fields so PISE can review and publish your profile.
```

---

## 11.6 Required Fields for Completeness

A mentor profile is considered complete when these fields exist:

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

---

## 11.7 Calendly URL Validation

MVP validation should require:

* valid URL format,
* starts with `https://`.

Recommended behavior:

* block clearly invalid URLs,
* show warning if URL does not contain `calendly.com`,
* do not block saving only because URL does not contain `calendly.com`,
* do not verify actual Calendly availability automatically.

Warning example:

```text
This link does not look like a standard Calendly URL. Please double-check before saving.
```

Error example:

```text
Please enter a valid URL starting with https://.
```

---

## 11.8 Save Behavior

When mentor saves profile:

* validate required field formats,
* save allowed profile fields,
* update `updated_at`,
* if Calendly URL changed, update `calendly_url_updated_at` and `calendly_url_updated_by`,
* show success message.

Success message:

```text
Your mentor profile has been updated.
```

Important:

* Saving profile does not publish the mentor.
* Admin still controls publish/unpublish.

---

## 11.9 Acceptance Criteria

* mentor can view own profile management page,
* mentor can update own profile content,
* mentor can update own Calendly link,
* invalid URL is rejected,
* non-standard Calendly URL shows warning,
* mentor sees completeness status,
* mentor sees published/unpublished status,
* mentor cannot publish themselves,
* mentor cannot edit another mentor’s profile,
* mentor without linked profile sees clear empty state.

---

## 12. Admin Mentor Management

## 12.1 Purpose

Admins manage mentor readiness and publishing.

Admin is not expected to write every mentor profile from scratch. Mentor should own profile content.

Admin controls visibility.

---

## 12.2 Admin Mentor List

Admin mentor list should show:

* mentor name,
* current role/title,
* linked mentor user status,
* profile completeness status,
* Calendly URL status,
* published status,
* last updated date,
* actions.

Actions:

* create mentor,
* edit,
* publish,
* unpublish.

---

## 12.3 Create Mentor Profile Shell

Admin can create a mentor profile shell with minimal information.

Minimum fields for shell:

* mentor name,
* linked mentor user, if available,
* email reference or note if linked user is not available yet.

A shell can be incomplete and unpublished.

Purpose:

* allow mentor to log in later and complete the profile,
* allow admin to prepare mentor list before all content is ready.

---

## 12.4 Admin Edit Mentor Profile

Admin can edit or override all mentor profile fields if needed.

Admin editable fields:

* linked mentor user,
* name,
* photo/avatar URL,
* current role/title,
* short bio,
* location,
* disciplines,
* industries,
* support areas / expertise tags,
* what this mentor can help with,
* suitable mentee profile,
* suggested topics mentees can ask about,
* booking instruction,
* Calendly URL,
* published status.

Admin should mainly use edit to:

* fix mistakes,
* support mentors who need help,
* update broken Calendly link,
* adjust categories,
* publish or unpublish profile.

---

## 12.5 Required Fields for Publishing

Admin can publish a mentor only if these fields are complete:

* name,
* current role/title,
* short bio,
* at least one location,
* at least one discipline,
* at least one industry,
* what this mentor can help with,
* Calendly URL,
* valid URL format starting with `https://`.

Recommended optional fields:

* photo/avatar,
* support areas,
* suitable mentee profile,
* suggested topics,
* booking instruction,
* linked mentor user.

---

## 12.6 Publish Behavior

When admin clicks publish:

1. System checks required fields.
2. If complete, set `is_published = true`.
3. If incomplete, block publish and show missing fields.
4. If URL is valid but does not contain `calendly.com`, show warning.

Error example:

```text
Cannot publish this mentor yet. Missing: discipline, Calendly URL.
```

Warning example:

```text
This booking link does not look like a standard Calendly URL. Please double-check it before publishing.
```

---

## 12.7 Unpublish Behavior

When admin unpublishes:

* set `is_published = false`,
* mentor disappears from mentee mentor list,
* direct profile link should not be accessible to mentees,
* mentor owner can still view and edit their own profile.

---

## 12.8 Acceptance Criteria

* admin can view mentor list,
* admin can create mentor profile shell,
* admin can link mentor profile to mentor user,
* admin can edit mentor profile,
* admin can review completeness status,
* admin can publish complete mentor profile,
* admin cannot publish incomplete profile,
* admin can unpublish mentor anytime,
* unpublished mentor is hidden from mentees,
* mentor owner can still edit unpublished own profile.

---

## 13. Approved User Access

## 13.1 Purpose

The portal must control who can access the private platform.

For MVP, approved users can be managed directly in the database or Supabase.

Do not build an admin user management UI unless explicitly requested.

---

## 13.2 Approved User Fields

Approved user should include:

* email,
* name,
* role,
* status.

Role values:

* mentee,
* mentor,
* admin.

Status values:

* active,
* inactive.

---

## 13.3 Login Behavior

* active approved user can log in,
* inactive user cannot access portal,
* unknown email cannot access portal.

---

## 13.4 Acceptance Criteria

* approved-user access is enforced,
* only active approved users can log in,
* role controls page access,
* inactive users are blocked,
* no public signup is available.

---

## 14. External Feedback Collection

## 14.1 Purpose

PISE collects basic feedback after mentorship sessions.

For MVP, feedback should be collected using an external form such as Google Form or Tally.

Do not build:

* in-app feedback submission,
* feedback database,
* admin feedback response management.

---

## 14.2 Feedback Form Link

The portal should support one external feedback form URL.

The URL can be configured through:

* environment variable,
* simple app config,
* or static constant if needed for MVP speed.

---

## 14.3 Feedback Entry Points

Show the external feedback form link in simple places:

* home page,
* mentor profile page,
* footer or navigation item if easy.

Recommended label:

```text
Submit session feedback
```

Recommended helper text:

```text
After your mentorship session, please share quick feedback so PISE can improve the experience.
```

---

## 14.4 External Form Fields

The external form should collect:

* respondent role,
* respondent name/email,
* mentor name,
* mentee name/email,
* session date,
* whether the session happened,
* rating,
* what was helpful,
* what can be improved,
* whether follow-up is needed.

These fields are owned by the external form, not the portal.

---

## 14.5 Acceptance Criteria

* user can access external feedback form link,
* feedback link opens in a new tab,
* portal does not store feedback responses,
* portal does not build feedback admin review.

---

## 15. Functional Data Fields

This section lists functional fields only. Exact database schema should be defined in `03_DATA_MODEL.md`.

---

## 15.1 User

* id,
* email,
* name,
* role,
* status,
* created_at,
* updated_at.

---

## 15.2 Mentor Profile

* id,
* user_id,
* slug,
* name,
* photo_url,
* role_title,
* short_bio,
* location_slugs,
* discipline_slugs,
* industry_slugs,
* support_area_slugs,
* what_i_can_help_with,
* suitable_mentee_profile,
* suggested_topics,
* booking_instruction,
* calendly_url,
* calendly_url_updated_at,
* calendly_url_updated_by,
* is_published,
* created_at,
* updated_at.

---

## 15.3 App Config

* feedback_form_url.

This can be stored in environment config, static app config, or database depending on implementation simplicity.

No feedback response table is required for MVP.

---

## 16. Validation Rules

## 16.1 Email

* required,
* valid email format.

## 16.2 URL

For Calendly URL:

* required when mentor is published,
* must be valid URL format,
* must start with `https://`,
* show warning if it does not contain `calendly.com`,
* do not verify availability automatically.

For external feedback form URL:

* must be valid URL format,
* should start with `https://`.

## 16.3 Mentor Required Fields for Completeness and Publish

Required:

* name,
* current role/title,
* short bio,
* at least one location,
* at least one discipline,
* at least one industry,
* what this mentor can help with,
* valid Calendly URL starting with `https://`.

Optional:

* photo/avatar URL,
* support areas,
* suitable mentee profile,
* suggested topics,
* booking instruction.

---

## 17. Loading, Empty, Warning, and Error States

## 17.1 Loading States

Required loading states:

* login submission,
* mentor list loading,
* mentor profile loading,
* mentor profile management loading,
* admin mentor list loading,
* save/update actions.

---

## 17.2 Empty States

Mentor list with no published mentors:

```text
No mentors are available yet.
Please check back later.
```

No filter result:

```text
No mentors match your current filters.
Try removing one filter or browsing all mentors.
```

Admin no mentors:

```text
No mentor profiles have been created yet.
Create the first mentor profile to get started.
```

Mentor has no linked profile:

```text
Your mentor profile is not connected yet.
Please contact the PISE team for support.
```

---

## 17.3 Warning States

Non-standard Calendly URL:

```text
This link does not look like a standard Calendly URL. Please double-check before saving.
```

Unpublished mentor profile:

```text
Your profile is not published yet. PISE admin will publish it after review.
```

Incomplete mentor profile:

```text
Complete the required fields so PISE can review and publish your profile.
```

---

## 17.4 Error States

Invalid Calendly URL:

```text
Please enter a valid URL starting with https://.
```

Unauthorized access:

```text
You do not have permission to access this page.
```

Failed save:

```text
Something went wrong. Please try again.
```

Publish validation failed:

```text
Cannot publish this mentor yet. Please complete the required fields first.
```

---

## 18. Optional Tracking Events

Tracking is optional.

Do not add an analytics provider unless explicitly requested.

If analytics is already available or very easy to add, these events are useful:

* user_logged_in,
* mentor_list_viewed,
* mentor_filter_applied,
* mentor_profile_viewed,
* calendly_link_clicked,
* feedback_link_clicked,
* mentor_profile_updated,
* mentor_calendly_url_updated,
* mentor_published,
* mentor_unpublished.

Do not block MVP launch if analytics is not ready.

---

## 19. Out of Scope

Do not build:

* native booking system,
* native availability management,
* Google Calendar integration,
* Google Meet integration,
* Calendly API integration,
* Calendly webhook integration,
* booking sync,
* attendance tracking,
* automated reminders,
* in-app feedback form,
* feedback database,
* feedback admin review,
* advanced search,
* mentor ranking,
* AI matching,
* complex recommendation logic,
* payment,
* public signup,
* in-app chat,
* complex analytics dashboard,
* complex multi-cohort management,
* required language filter,
* multi-role permission model,
* admin user management UI unless explicitly requested,
* support area filter unless explicitly requested.

If any implementation path requires these, simplify the solution.

---

## 20. AI Coding Instructions

When using this spec for vibe coding:

1. Build only the MVP behavior described here.
2. Do not invent booking logic.
3. Do not add Calendly API or webhook integration.
4. Do not add Google Calendar or Google Meet integration.
5. Do not build in-app feedback.
6. Do not build public signup.
7. Keep pages simple and role-based.
8. Use one primary role per user.
9. Mentor should own profile content.
10. Admin should own publishing control.
11. Prefer CRUD and clear UI over automation.
12. Keep mentor discovery based on simple attributes.
13. Do not build support area filter unless explicitly requested.
14. Use reusable components for mentor cards, tags, filters, empty states, warning states, and form fields.
15. Validate Calendly URL before saving.
16. Protect admin and mentor-only routes.
17. Follow `07_DESIGN_SYSTEM.md` before implementing UI.
18. Follow `03_DATA_MODEL.md` before creating database tables.
19. Follow `06_TEST_PLAN.md` before considering the build complete.

---

## 21. Functional Completion Checklist

The MVP functional spec is complete when:

* approved active users can log in,
* unapproved users are blocked,
* inactive users are blocked,
* mentees can view home page,
* mentees can browse published mentors,
* mentees can filter mentors by location, discipline, and industry,
* mentees can clear filters,
* empty state appears when no mentors match,
* mentees can open mentor profile,
* mentees can click `Book via Calendly`,
* booking opens Calendly externally,
* portal does not create or manage bookings,
* mentors can access own profile management page,
* mentors can update own profile content,
* mentors can update own Calendly link,
* mentors can see completeness status,
* mentors can see published/unpublished status,
* mentors cannot publish themselves,
* mentors cannot edit another mentor’s profile,
* mentor without linked profile sees clear empty state,
* invalid Calendly URL is rejected,
* non-standard Calendly URL shows warning,
* admins can create mentor profile shells,
* admins can link mentor profile to mentor user,
* admins can edit mentor profiles,
* admins can review completeness status,
* admins can publish complete mentors,
* admins cannot publish incomplete mentors,
* admins can unpublish mentors,
* unpublished mentors are hidden from mentees,
* external feedback form link is available,
* portal does not store feedback responses,
* UI works on desktop and mobile,
* no native booking system is built,
* no Calendly API/webhook integration is built,
* no in-app feedback module is built.
