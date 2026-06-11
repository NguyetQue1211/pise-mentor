# 06_TEST_PLAN.md — PISE Mentorship Portal MVP

## 1. Purpose

This document defines the MVP test plan for the PISE Mentorship Portal.

This file is primarily for Claude Code to use during:

* bug fixing,
* polish,
* final readiness check,
* pre-launch validation.

Claude Code should not read this file before every implementation step.

Claude Code should read this file when:

* completing Milestone 9,
* completing Milestone 10,
* debugging a failed flow,
* checking whether the MVP is ready to launch.

---

## 2. Test Scope

This test plan validates that the MVP supports:

* invite-only login,
* role-based access,
* mentor browsing,
* mentor filtering,
* mentor profile viewing,
* external Calendly booking access,
* mentor profile self-management,
* admin mentor publishing,
* external feedback link access.

This test plan also checks that out-of-scope features were not accidentally built.

---

## 3. Source Documents

Use these docs as the source of truth:

```text
01_PRD.md
02_MVP_FUNCTIONAL_SPEC.md
03_DATA_MODEL.md
04_UI_FLOW.md
05_BUILD_PLAN.md
07_DESIGN_SYSTEM.md
```

If a test conflicts with product requirements, follow the PRD and functional spec.

---

## 4. Test Users

Create or prepare these test users in `app_users`.

```text
Mentee User
- role: mentee
- status: active

Mentor User With Linked Profile
- role: mentor
- status: active
- linked to one mentor profile

Mentor User Without Linked Profile
- role: mentor
- status: active
- not linked to any mentor profile

Admin User
- role: admin
- status: active

Inactive User
- any role
- status: inactive

Unknown User
- email not present in app_users
```

---

## 5. Test Data

Prepare these mentor profiles.

## 5.1 Published Complete Mentor

```text
is_published = true
required fields complete
valid Calendly URL
has location, discipline, industry
```

Expected:

* visible on mentor list,
* accessible from mentor profile page,
* bookable through Calendly CTA.

## 5.2 Unpublished Complete Mentor

```text
is_published = false
required fields complete
valid Calendly URL
```

Expected:

* hidden from mentee mentor list,
* hidden from mentee direct profile access,
* visible to admin,
* editable by linked mentor owner.

## 5.3 Incomplete Mentor Draft

```text
is_published = false
missing required fields
```

Expected:

* hidden from mentee mentor list,
* cannot be published,
* missing fields shown to mentor/admin.

## 5.4 Mentor With Invalid Calendly URL

```text
calendly_url is invalid or does not start with https://
```

Expected:

* cannot be published,
* validation error shown.

## 5.5 Mentor With Non-Standard Booking URL

```text
calendly_url starts with https://
but does not contain calendly.com
```

Expected:

* warning shown,
* can be saved if URL is valid,
* no availability check is performed.

---

## 6. Smoke Tests

Run these after every major milestone.

| Test                         | Expected Result                |
| ---------------------------- | ------------------------------ |
| App starts locally           | No startup error               |
| `/login` loads               | Login page visible             |
| `/home` without login        | Redirect or blocked            |
| `/mentors` without login     | Redirect or blocked            |
| `/admin` without login       | Redirect or blocked            |
| Published mentor list loads  | Mentor cards visible           |
| External Calendly link opens | Opens in new tab               |
| External feedback link opens | Opens in new tab if configured |

---

## 7. Authentication and Access Tests

## 7.1 Approved Active User Login

Steps:

1. Go to `/login`.
2. Enter active approved user email.
3. Request magic link.

Expected:

* login request succeeds,
* user can access portal after authentication.

## 7.2 Unknown Email Login

Steps:

1. Go to `/login`.
2. Enter email not in `app_users`.

Expected:

* login is blocked,
* user does not get portal access,
* clear access-denied message is shown.

## 7.3 Inactive User Login

Steps:

1. Go to `/login`.
2. Enter inactive user email.

Expected:

* login is blocked,
* inactive user cannot access portal.

## 7.4 Protected Routes

Test each protected route while logged out:

```text
/home
/mentors
/mentors/[slug]
/mentor/profile
/admin
/admin/mentors
/admin/mentors/new
/admin/mentors/[id]/edit
```

Expected:

* unauthenticated user cannot access protected content.

---

## 8. Role-Based Access Tests

## 8.1 Mentee Access

Logged in as mentee.

| Route                       | Expected       |
| --------------------------- | -------------- |
| `/home`                     | Accessible     |
| `/mentors`                  | Accessible     |
| `/mentors/[published-slug]` | Accessible     |
| `/mentor/profile`           | Not accessible |
| `/admin`                    | Not accessible |
| `/admin/mentors`            | Not accessible |

## 8.2 Mentor Access

Logged in as mentor.

| Route                       | Expected                               |
| --------------------------- | -------------------------------------- |
| `/home`                     | Accessible                             |
| `/mentors`                  | Accessible                             |
| `/mentors/[published-slug]` | Accessible                             |
| `/mentor/profile`           | Accessible only for own linked profile |
| `/admin`                    | Not accessible                         |
| `/admin/mentors`            | Not accessible                         |

## 8.3 Admin Access

Logged in as admin.

| Route                      | Expected   |
| -------------------------- | ---------- |
| `/home`                    | Accessible |
| `/mentors`                 | Accessible |
| `/admin`                   | Accessible |
| `/admin/mentors`           | Accessible |
| `/admin/mentors/new`       | Accessible |
| `/admin/mentors/[id]/edit` | Accessible |

---

## 9. Mentee Flow Tests

## 9.1 Browse Published Mentors

Steps:

1. Log in as mentee.
2. Go to `/mentors`.

Expected:

* only published mentors appear,
* unpublished mentors do not appear,
* mentor cards show key profile information.

## 9.2 Filter Mentors

Steps:

1. Go to `/mentors`.
2. Select one location filter.
3. Select one discipline filter.
4. Select one industry filter.
5. Clear filters.

Expected:

* list updates after filter selection,
* OR logic works within each filter group,
* AND logic works across groups,
* clear filters resets the list,
* empty state appears when no mentors match.

## 9.3 Open Mentor Profile

Steps:

1. Click `View Profile` on a mentor card.

Expected:

* mentor profile page opens,
* profile shows mentor background,
* profile shows what mentor can help with,
* profile shows suggested topics if available,
* profile shows booking instructions if available.

## 9.4 Book via Calendly

Steps:

1. Open a published mentor profile.
2. Click `Book via Calendly`.

Expected:

* Calendly URL opens in a new tab,
* portal does not create booking record,
* portal does not show booking confirmation page.

## 9.5 Feedback Link

Steps:

1. Open home or mentor profile.
2. Click `Submit session feedback`.

Expected:

* external feedback form opens in new tab,
* portal does not show in-app feedback form,
* portal does not store feedback response.

---

## 10. Mentor Flow Tests

## 10.1 Mentor With Linked Profile

Steps:

1. Log in as mentor with linked profile.
2. Go to `/mentor/profile`.

Expected:

* mentor sees own profile management page,
* mentor sees published/unpublished status,
* mentor sees complete/incomplete status,
* mentor sees missing fields if incomplete.

## 10.2 Mentor Without Linked Profile

Steps:

1. Log in as mentor without linked profile.
2. Go to `/mentor/profile`.

Expected:

```text
Your mentor profile is not connected yet.
Please contact the PISE team for support.
```

No edit form should appear.

## 10.3 Edit Own Profile

Steps:

1. Log in as mentor with linked profile.
2. Edit allowed profile fields.
3. Save.

Expected:

* save succeeds,
* updated fields persist,
* mentor cannot edit `slug`,
* mentor cannot edit `user_id`,
* mentor cannot edit `is_published`,
* saving does not publish the profile.

## 10.4 Update Calendly URL

Steps:

1. Enter valid `https://` Calendly URL.
2. Save.

Expected:

* save succeeds,
* URL persists,
* `calendly_url_updated_at` updates,
* `calendly_url_updated_by` updates if implemented.

## 10.5 Invalid Calendly URL

Steps:

1. Enter invalid URL.
2. Save.

Expected:

* save is blocked,
* error is shown:

```text
Please enter a valid URL starting with https://.
```

## 10.6 Non-Standard Booking URL

Steps:

1. Enter valid `https://` URL that does not contain `calendly.com`.
2. Save.

Expected:

* warning is shown,
* save can still proceed if valid URL,
* no availability check is performed.

## 10.7 Mentor Cannot Edit Another Mentor

Steps:

1. Log in as mentor.
2. Attempt to access or modify another mentor profile.

Expected:

* access is denied,
* update is blocked server-side.

---

## 11. Admin Flow Tests

## 11.1 Admin Mentor List

Steps:

1. Log in as admin.
2. Go to `/admin/mentors`.

Expected:

* all mentor profiles are visible,
* published and unpublished profiles are visible,
* completeness status is visible,
* Calendly URL status is visible,
* published status is visible.

## 11.2 Create Mentor Profile Draft

Steps:

1. Go to `/admin/mentors/new`.
2. Create profile with name and slug only.
3. Save.

Expected:

* profile is created,
* profile is unpublished,
* profile can be incomplete,
* profile does not appear to mentees.

## 11.3 Link Mentor User

Steps:

1. Open admin edit page for mentor profile.
2. Link profile to mentor user.
3. Save.

Expected:

* linked mentor can access `/mentor/profile`,
* linked mentor can edit own profile,
* other mentors cannot edit it.

## 11.4 Publish Complete Mentor

Steps:

1. Open complete mentor profile in admin edit page.
2. Click publish.

Expected:

* publish succeeds,
* `is_published = true`,
* mentor appears on `/mentors`,
* mentor profile page is accessible to mentees.

## 11.5 Block Publish for Incomplete Mentor

Steps:

1. Open incomplete mentor draft.
2. Click publish.

Expected:

* publish is blocked,
* missing fields are shown,
* `is_published` remains false,
* mentor remains hidden from mentees.

## 11.6 Unpublish Mentor

Steps:

1. Open published mentor in admin edit page.
2. Click unpublish.

Expected:

* `is_published = false`,
* mentor disappears from mentee mentor list,
* mentee direct profile access is blocked,
* mentor owner can still edit own profile.

## 11.7 Published Mentor Cannot Become Invalid

Steps:

1. Open published mentor in admin edit page.
2. Remove a required field.
3. Save.

Expected MVP behavior:

* save is blocked, or
* app requires unpublish before saving invalid state.

Preferred:

```text
Block saving changes that would make a published mentor incomplete.
```

---

## 12. Publishing and Visibility Tests

| Scenario                                        | Expected                                  |
| ----------------------------------------------- | ----------------------------------------- |
| Published complete mentor                       | Visible to mentees                        |
| Unpublished complete mentor                     | Hidden from mentees                       |
| Unpublished incomplete mentor                   | Hidden from mentees                       |
| Direct URL to unpublished mentor as mentee      | Blocked or not found                      |
| Direct URL to unpublished mentor as admin       | Accessible                                |
| Direct URL to own unpublished profile as mentor | Accessible through own profile management |
| Mentor saves profile                            | Does not auto-publish                     |
| Admin publishes profile                         | Visible to mentees                        |

---

## 13. External Link Tests

## 13.1 Calendly Link

Expected:

* opens in new tab,
* uses mentor’s latest saved URL,
* no portal booking record is created,
* no internal confirmation UI is shown.

## 13.2 Feedback Link

Expected:

* opens in new tab,
* uses configured external form URL,
* no in-app feedback form is shown,
* no feedback response is stored.

## 13.3 Missing Feedback URL

Expected:

* feedback link is hidden, or
* simple unavailable message is shown.

---

## 14. UI and Responsive Tests

Test these screens on desktop and mobile width:

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

Check:

* text is readable,
* buttons are tappable,
* mentor cards stack on mobile,
* filters are usable on mobile,
* forms are readable on mobile,
* admin table is usable or converted to cards,
* no horizontal overflow,
* loading states appear,
* empty states are clear,
* error states are understandable,
* warning states are visible.

---

## 15. Design System Tests

Check:

* Inter font is used,
* Vietnamese text renders correctly,
* color tokens are used consistently,
* mentor cards follow design system,
* tags and chips are consistent,
* buttons are consistent,
* forms are clean and readable,
* UI feels warm, simple, and connected to PISE.

Vietnamese font test:

```text
PISE giúp mentee tìm đúng mentor, chuẩn bị câu hỏi, và đặt lịch mentorship qua Calendly.
```

Expected:

* Vietnamese diacritics render correctly,
* no broken or inconsistent fallback font.

---

## 16. Out-of-Scope Regression Tests

Confirm the app does not include:

```text
native booking system
booking database
session database
availability database
Calendly API integration
Calendly webhook integration
Google Calendar integration
Google Meet integration
in-app feedback form
feedback response database
admin feedback dashboard
admin analytics dashboard
admin user management UI
filter option management UI
image upload
support area filtering
advanced search
mentor ranking
AI mentor matching
recommendation logic
payment
public signup
multi-role permission system
```

If any of these exist, remove or disable before MVP launch unless explicitly approved.

---

## 17. Final MVP Readiness Checklist

The MVP is ready when all statements are true:

```text
Approved active users can log in.
Unknown users are blocked.
Inactive users are blocked.
Role-based access works.
Mentees can browse published mentors.
Mentees can filter mentors by location, discipline, and industry.
Mentees can open mentor profiles.
Mentees can open Calendly links externally.
Mentors can edit their own profile.
Mentors can update their own Calendly link.
Mentors cannot publish themselves.
Mentors cannot edit another mentor’s profile.
Admins can create mentor profile drafts.
Admins can link mentor profiles to mentor users.
Admins can publish complete mentors.
Admins cannot publish incomplete mentors.
Admins can unpublish mentors.
Unpublished mentors are hidden from mentees.
External feedback link works.
No booking data is stored.
No feedback responses are stored.
UI works on desktop and mobile.
No out-of-scope feature was added.
```

---

## 18. Claude Code Testing Instructions

When asked to test or verify the MVP, Claude Code should:

1. Read this file.
2. Inspect the relevant implementation.
3. Identify which test cases can be checked by code review.
4. Identify which test cases require manual browser testing.
5. Report failed or missing cases.
6. Fix only the failed cases when asked.
7. Do not add new product scope during test fixes.

When fixing test failures:

* make the smallest safe change,
* do not refactor unrelated code,
* do not add new routes,
* do not add new tables,
* do not add out-of-scope features.
