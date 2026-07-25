# 03_DATA_MODEL.md — PISE Mentorship Portal MVP

## 1. Purpose

This document defines the recommended tech stack, architecture, and data model for the PISE Mentorship Portal MVP.

This document is optimized for AI-assisted coding with Claude Code.

The data model must support the latest product direction:

* invite-only access
* one primary role per user
* mentor discovery
* mentor filtering
* mentor profile self-management
* admin mentor profile draft creation
* admin review and publishing control
* Calendly booking link access
* external feedback form link

Do not create booking, session, availability, calendar, or feedback response tables for MVP.

---

## 2. Recommended Tech Stack

## 2.1 Frontend

Use:

* Next.js
* TypeScript
* React
* Tailwind CSS
* shadcn/ui or simple reusable components

Reason:

* Fast to build with Claude Code.
* Good support for route-based product UI.
* Works well with Supabase Auth and Postgres.
* Easy to deploy on Vercel.
* Suitable for simple CRUD and mentor browsing.

## 2.2 Backend

Use:

* Next.js Server Actions or API Routes
* Supabase server client

Do not build a separate backend service for MVP.

Reason:

* MVP only needs simple CRUD, role checks, and form submissions.
* A separate backend adds unnecessary complexity.
* Server Actions/API Routes are enough for controlled writes.

## 2.3 Database

Use:

* Supabase Postgres

Reason:

* Relational data fits approved users, mentor profiles, filter options, and app config.
* Easy to inspect and update during MVP.
* Works well with Row Level Security.

## 2.4 Authentication

Use:

* Supabase Auth
* Email magic link login
* Approved-user whitelist check before sending login link

Important:

* Public signup is not allowed.
* Unknown emails should not be allowed to create app access.
* App access is controlled through the `app_users` table.

## 2.5 File Storage

Use:

* `photo_url` text field (unchanged — still just stores a public image URL)
* Supabase Storage bucket `mentor-photos` (public, 5MB file size limit, `image/jpeg` / `image/png` / `image/webp` only) as the source of that URL for mentor-uploaded photos

Decision update (2026-07-25): mentor photo upload was explicitly requested and implemented. This supersedes the original MVP decision to only accept a pasted external URL. See §15.5.

Uploads go through a Server Action using the service-role admin client (same trust model as every other mentor-profile write — see §14.4). This means no `storage.objects` RLS policies are required: writes are only ever performed server-side (bypassing RLS via the service role key), and reads are public because the bucket itself is marked `public`, not because of an RLS policy.

Admin-side mentor draft creation (`AdminMentorForm`) still uses a pasted URL — it was not part of this request. Extend it the same way later only if explicitly requested.

## 2.6 Deployment

Use:

* Vercel for the Next.js app
* Supabase hosted project for Auth and Database

---

## 3. High-Level Architecture

```text
User Browser
  ↓
Next.js App
  ↓
Supabase Auth
  ↓
Supabase Postgres
```

External services:

```text
Calendly
  → Handles booking, availability, meeting links, reminders, rescheduling, cancellation

Google Form / Tally
  → Handles post-session feedback collection
```

The PISE portal does not own booking or feedback response data in MVP.

---

## 4. Architecture Rules

## Rule 1 — No Separate Backend

Use Next.js Server Actions or API Routes with Supabase.

Do not create an Express, NestJS, FastAPI, or separate backend service.

## Rule 2 — No Booking Database

Do not create:

* bookings
* sessions
* availability slots
* calendar events
* meeting links
* attendance records

Calendly owns booking-related data.

## Rule 3 — No Feedback Response Database

Do not create feedback response tables.

The portal only stores or displays the external feedback form URL.

## Rule 4 — Mentor Owns Profile Content

Mentors can edit their own profile content.

Admin controls publishing.

## Rule 5 — Admin Creates Mentor Shell

Admin can create an incomplete mentor profile shell.

Mentor completes the profile later.

Therefore, most mentor profile fields should be nullable at database level and validated only when publishing.

## Rule 6 — Keep Filtering Simple

Mentor filters use slug arrays stored directly on `mentor_profiles`.

Do not create a many-to-many join table for mentor tags in MVP.

## Rule 7 — One Primary Role Per User

Each user has one role only:

* `mentee`
* `mentor`
* `admin`

Do not build multi-role permission logic.

---

## 5. Recommended Tables

MVP needs only these tables:

```text
app_users
mentor_profiles
filter_options
app_config
```

Do not add more tables unless explicitly required.

---

## 6. Table: app_users

## 6.1 Purpose

Stores approved portal users.

This table acts as the whitelist for portal access.

A user can access the app only when:

```text
app_users.status = active
```

## 6.2 Fields

| Field        | Type        | Required | Notes                                              |
| ------------ | ----------- | -------: | -------------------------------------------------- |
| id           | uuid        |      Yes | Primary key                                        |
| auth_user_id | uuid        |       No | Supabase Auth user id; nullable before first login |
| email        | text        |      Yes | Unique, lowercase                                  |
| name         | text        |       No | Display name                                       |
| role         | text        |      Yes | `mentee`, `mentor`, or `admin`                     |
| status       | text        |      Yes | `active` or `inactive`                             |
| created_at   | timestamptz |      Yes | Default now                                        |
| updated_at   | timestamptz |      Yes | Default now                                        |

## 6.3 Constraints

Role must be one of:

```text
mentee
mentor
admin
```

Status must be one of:

```text
active
inactive
```

Email should be unique and stored lowercase.

## 6.4 Access Rules

* Admin can create, read, update, and deactivate users.
* Active authenticated users can read their own user record.
* Non-admin users cannot manage other users.
* Inactive users cannot access protected app pages.

## 6.5 Login Behavior

Recommended login flow:

1. User enters email on login page.
2. App lowercases the email.
3. Server checks `app_users.email`.
4. If no active user exists, block login.
5. If active user exists, send magic link.
6. After successful authentication, link Supabase `auth.users.id` to `app_users.auth_user_id` if it is empty.

Important:

* Do not allow public signup.
* Do not create app access for unknown emails.
* Use server-side validation, not only client-side checks.

---

## 7. Table: mentor_profiles

## 7.1 Purpose

Stores mentor profile content, discovery attributes, publish status, and Calendly URL.

This table powers:

* mentor card
* mentor list
* mentor detail page
* mentor profile management page
* admin mentor management
* publish/unpublish behavior

## 7.2 Fields

| Field                   | Type        | Required | Notes                                                   |
| ----------------------- | ----------- | -------: | ------------------------------------------------------- |
| id                      | uuid        |      Yes | Primary key                                             |
| user_id                 | uuid        |       No | References `app_users.id`; links mentor user to profile |
| slug                    | text        |      Yes | Unique readable URL slug                                |
| name                    | text        |      Yes | Mentor display name                                     |
| photo_url               | text        |       No | External image URL                                      |
| role_title            | text        |       No | Required only before publish                            |
| short_bio               | text        |       No | Required only before publish                            |
| location_slugs          | text[]      |      Yes | Default empty array                                     |
| discipline_slugs        | text[]      |      Yes | Default empty array                                     |
| industry_slugs          | text[]      |      Yes | Default empty array                                     |
| support_area_slugs      | text[]      |      Yes | Default empty array                                     |
| what_i_can_help_with    | text        |       No | Required only before publish                            |
| suitable_mentee_profile | text        |       No | Optional                                                |
| suggested_topics        | text        |       No | Optional                                                |
| booking_instruction     | text        |       No | Optional                                                |
| calendly_url            | text        |       No | Required only before publish                            |
| calendly_url_updated_at | timestamptz |       No | Updated when Calendly link changes                      |
| calendly_url_updated_by | uuid        |       No | References `app_users.id`                               |
| is_published            | boolean     |      Yes | Default false                                           |
| created_at              | timestamptz |      Yes | Default now                                             |
| updated_at              | timestamptz |      Yes | Default now                                             |

## 7.3 Important Design Decision

Do not make all profile content fields `NOT NULL`.

Reason:

Admin needs to create a mentor profile shell before the mentor completes all content.

Required fields should be enforced by application validation when:

* checking profile completeness
* publishing mentor profile

They should not block draft/shell creation.

## 7.4 Why Use Text Arrays

Use text arrays for:

* `location_slugs`
* `discipline_slugs`
* `industry_slugs`
* `support_area_slugs`

Reason:

* fewer tables
* simpler admin form
* simpler mentor profile form
* simpler filtering for MVP scale
* easier for Claude Code to implement
* no many-to-many join table needed

The display labels should come from `filter_options`.

Example:

```text
location_slugs = ['ho-chi-minh-city', 'remote-online']
discipline_slugs = ['product-management', 'ux-research']
industry_slugs = ['saas', 'education']
support_area_slugs = ['career-orientation', 'portfolio-preparation']
```

## 7.5 Required Fields for Completeness

A mentor profile is considered complete when these fields are present:

* name
* slug
* role_title
* short_bio
* at least one location slug
* at least one discipline slug
* at least one industry slug
* what_i_can_help_with
* calendly_url
* valid Calendly URL format

Optional fields:

* photo_url
* support_area_slugs
* suitable_mentee_profile
* suggested_topics
* booking_instruction

## 7.6 Required Fields for Publishing

Admin can publish a mentor only when the profile is complete.

Publishing requires:

* all completeness-required fields
* valid Calendly URL
* `is_published` is set by admin only

## 7.7 Calendly URL Validation

For MVP, Calendly URL validation should require:

* valid URL format
* starts with `https://`

Recommended behavior:

* block invalid URLs
* show warning if URL does not contain `calendly.com`
* do not block saving only because URL does not contain `calendly.com`
* do not check availability automatically

## 7.8 Publish Rule

A mentor is visible to mentees only when:

```text
is_published = true
AND required fields are complete
AND calendly_url is valid
```

## 7.9 Mentor Ownership Rule

A mentor profile can be linked to one mentor user through:

```text
mentor_profiles.user_id = app_users.id
```

A mentor owner can update their own profile content.

Mentor can edit:

* photo_url
* role_title
* short_bio
* location_slugs
* discipline_slugs
* industry_slugs
* support_area_slugs
* what_i_can_help_with
* suitable_mentee_profile
* suggested_topics
* booking_instruction
* calendly_url

Mentor cannot edit:

* user_id
* slug, unless explicitly allowed
* name, if PISE wants name controlled by admin
* is_published
* admin-only fields
* another mentor’s profile

Recommended MVP rule:

* Mentor can edit `name` only if PISE is comfortable with mentors changing display names.
* Otherwise, keep `name` admin-controlled.

For simplicity, Claude Code should treat `name` and `slug` as admin-controlled unless explicitly requested otherwise.

## 7.10 Admin Rule

Admin can:

* create mentor profile shell
* link mentor profile to mentor user
* edit all mentor profile fields
* review completeness
* publish mentor
* unpublish mentor

Admin should not need to write all mentor content. Mentor should complete their own profile.

## 7.11 Access Rules

* Approved active users can read published mentor profiles.
* Admin can read all mentor profiles.
* Admin can create, update, publish, and unpublish mentor profiles.
* Mentor owner can read their own mentor profile even if unpublished.
* Mentor owner can update own profile content except admin-controlled fields.
* Mentees cannot update mentor profiles.
* Mentors cannot publish or unpublish themselves.

---

## 8. Table: filter_options

## 8.1 Purpose

Stores allowed filter options and display labels.

This keeps filter values maintainable without changing filtering logic.

Use this table for:

* locations
* disciplines
* industries
* support areas

## 8.2 Fields

| Field      | Type        | Required | Notes                                                   |
| ---------- | ----------- | -------: | ------------------------------------------------------- |
| id         | uuid        |      Yes | Primary key                                             |
| type       | text        |      Yes | `location`, `discipline`, `industry`, or `support_area` |
| slug       | text        |      Yes | Stored in mentor profile arrays                         |
| label      | text        |      Yes | Display label                                           |
| sort_order | integer     |      Yes | Default 0                                               |
| is_active  | boolean     |      Yes | Default true                                            |
| created_at | timestamptz |      Yes | Default now                                             |
| updated_at | timestamptz |      Yes | Default now                                             |

## 8.3 Constraints

Type must be one of:

```text
location
discipline
industry
support_area
```

Unique constraint:

```text
type + slug
```

## 8.4 Access Rules

* Approved active users can read active filter options.
* Admin can create, update, deactivate, and reorder filter options.
* Non-admin users cannot manage filter options.

## 8.5 MVP Admin UI Decision

Do not build filter option management UI in MVP unless explicitly requested.

Filter options can be seeded and updated directly in Supabase.

---

## 9. Table: app_config

## 9.1 Purpose

Stores simple app-level configuration.

For MVP, this is mainly used for the external feedback form URL.

## 9.2 Fields

| Field       | Type        | Required | Notes                     |
| ----------- | ----------- | -------: | ------------------------- |
| key         | text        |      Yes | Primary key               |
| value       | text        |       No | Config value              |
| description | text        |       No | Admin note                |
| updated_at  | timestamptz |      Yes | Default now               |
| updated_by  | uuid        |       No | References `app_users.id` |

## 9.3 Required Config

```text
feedback_form_url
```

## 9.4 Access Rules

* Approved active users can read public app config values needed by the UI.
* Admin can update app config.
* Non-admin users cannot update app config.

## 9.5 Simpler Option

If `app_config` slows down implementation, `feedback_form_url` can be stored as an environment variable.

Do not create a feedback response table.

---

## 10. Tables Not Required

Do not create:

```text
mentor_profile_tags
bookings
sessions
availability_slots
calendar_events
meeting_links
attendance_records
feedback_responses
notifications
recommendations
mentor_scores
```

Reason:

* mentor tags are stored as text arrays on `mentor_profiles`
* booking happens in Calendly
* feedback responses live in Google Form or Tally
* MVP does not support AI matching, ranking, or recommendation

---

## 11. Completeness Logic

## 11.1 Purpose

Completeness is used to help:

* mentor understand missing profile fields
* admin decide whether a mentor can be published

Completeness should be computed in application logic.

Do not store `profile_status` unless explicitly needed.

## 11.2 Completeness Check

A mentor profile is complete when:

```text
name exists
AND slug exists
AND role_title exists
AND short_bio exists
AND location_slugs length > 0
AND discipline_slugs length > 0
AND industry_slugs length > 0
AND what_i_can_help_with exists
AND calendly_url is valid
```

## 11.3 Missing Fields

The app should return a list of missing fields.

Example:

```text
Missing: current role, discipline, Calendly URL
```

## 11.4 Publish Validation

Before setting `is_published = true`, run completeness check.

If incomplete:

* block publish
* keep `is_published = false`
* show missing fields

---

## 12. Filtering Logic

## 12.1 Filter Inputs

The mentor list can filter by:

* selected location slugs
* selected discipline slugs
* selected industry slugs

Support area filtering is not required for MVP.

## 12.2 Matching Rule

Use:

* OR logic within the same filter group
* AND logic across different filter groups

Example:

```text
Selected filters:
location = Ho Chi Minh City OR Remote / Online
discipline = Product Management
industry = SaaS OR Education

Result:
Show mentors who match:
one selected location
AND Product Management
AND one selected industry
```

## 12.3 MVP Implementation Option

Because MVP scale is small, filtering can be implemented in one of two ways.

### Option A — Client-Side Filtering

Fetch published mentors and filter in the browser.

Recommended if mentor count is small.

### Option B — Server-Side Filtering

Send selected slugs to a server action/API route and query Postgres.

Recommended if implementation remains simple.

Do not build complex search or ranking.

---

## 13. Recommended Indexes

## 13.1 app_users

```sql
create unique index app_users_email_unique on app_users (lower(email));
create unique index app_users_auth_user_id_unique on app_users (auth_user_id) where auth_user_id is not null;
create index app_users_role_idx on app_users (role);
create index app_users_status_idx on app_users (status);
```

## 13.2 mentor_profiles

```sql
create unique index mentor_profiles_slug_unique on mentor_profiles (slug);
create index mentor_profiles_user_id_idx on mentor_profiles (user_id);
create index mentor_profiles_is_published_idx on mentor_profiles (is_published);
create index mentor_profiles_updated_at_idx on mentor_profiles (updated_at desc);

create index mentor_profiles_location_slugs_idx on mentor_profiles using gin (location_slugs);
create index mentor_profiles_discipline_slugs_idx on mentor_profiles using gin (discipline_slugs);
create index mentor_profiles_industry_slugs_idx on mentor_profiles using gin (industry_slugs);
```

## 13.3 filter_options

```sql
create unique index filter_options_type_slug_unique on filter_options (type, slug);
create index filter_options_type_active_idx on filter_options (type, is_active);
```

---

## 14. RLS and Security Approach

## 14.1 Recommended MVP Approach

Enable Row Level Security on:

```text
app_users
mentor_profiles
filter_options
app_config
```

Keep RLS policies simple.

Do not create overly complex RLS helper functions unless needed.

## 14.2 Policy Summary

### app_users

* Admin can select, insert, and update all app users.
* User can select own app user record.
* No public read.
* No non-admin insert/update.

### mentor_profiles

* Active approved users can select published mentors.
* Admin can select and update all mentors.
* Mentor owner can select own profile.
* Mentor owner can update own profile content except admin-controlled fields.
* Mentees cannot update mentor profiles.

### filter_options

* Active approved users can select active filter options.
* Admin can manage filter options.
* If no filter admin UI is built, options can be managed directly in Supabase.

### app_config

* Active approved users can read `feedback_form_url`.
* Admin can update app config.
* If using environment variable instead, skip this table.

## 14.3 Important Security Rule

Do not rely only on frontend role checks.

All write actions should validate role and ownership on the server side.

## 14.4 Recommended Write Pattern

For MVP, prefer controlled Server Actions/API Routes for writes.

Recommended reason:

* easier to validate role and ownership
* easier to limit which fields mentors can update
* prevents accidentally exposing broad update permissions from the client

---

## 15. Server Actions / API Routes

Recommended server actions:

```text
requestMagicLink(email)
getCurrentAppUser()
getPublishedMentors(filters?)
getMentorProfile(slug)
getOwnMentorProfile()
updateOwnMentorProfile(data)
uploadMentorPhoto(file)
adminCreateMentorShell(data)
adminUpdateMentorProfile(mentor_id, data)
adminPublishMentor(mentor_id)
adminUnpublishMentor(mentor_id)
```

Do not build admin user management UI unless explicitly requested.

Approved users can be inserted directly in Supabase for MVP.

## 15.1 updateOwnMentorProfile

This action should:

1. Check logged-in user.
2. Check user role is `mentor`.
3. Find mentor profile where `mentor_profiles.user_id = app_users.id`.
4. Validate editable fields.
5. Validate Calendly URL if provided.
6. Update allowed mentor-owned fields only.
7. If Calendly URL changed:

   * update `calendly_url_updated_at`
   * update `calendly_url_updated_by`
8. Return success or validation error.

Mentor-owned fields:

* photo_url
* role_title
* short_bio
* location_slugs
* discipline_slugs
* industry_slugs
* support_area_slugs
* what_i_can_help_with
* suitable_mentee_profile
* suggested_topics
* booking_instruction
* calendly_url

Admin-controlled fields:

* user_id
* slug
* is_published

Recommended MVP rule:

* name is admin-controlled unless explicitly requested otherwise.

## 15.2 adminCreateMentorShell

This action should:

1. Check logged-in user is admin.
2. Create mentor profile with:

   * name
   * slug
   * optional linked user
3. Set `is_published = false`.
4. Allow other fields to remain empty.

## 15.3 adminPublishMentor

This action should:

1. Check logged-in user is admin.
2. Load mentor profile.
3. Run completeness check.
4. Validate Calendly URL.
5. If complete, set `is_published = true`.
6. If incomplete, return missing fields.

## 15.4 adminUnpublishMentor

This action should:

1. Check logged-in user is admin.
2. Set `is_published = false`.
3. Keep mentor profile editable by mentor owner.

## 15.5 uploadMentorPhoto

This action should:

1. Check logged-in user.
2. Check user role is `mentor`.
3. Validate the file server-side: MIME type in (`image/jpeg`, `image/png`, `image/webp`), size ≤ 5MB. Never trust client-side validation alone.
4. Upload to the `mentor-photos` bucket at a deterministic path `{user_id}/avatar.{ext}` using `upsert: true` so re-uploads overwrite the previous file instead of accumulating orphaned objects.
5. Read back the bucket's public URL for that path.
6. Return the public URL so the client can set it as `photo_url` and include it in the next `updateOwnMentorProfile` save.

Does not write to `mentor_profiles` directly — it only returns a URL. The existing `updateOwnMentorProfile` action still owns writing `photo_url` to the row, so the mentor-owned-fields rule in §15.1 stays the single source of truth.

---

## 16. Suggested SQL Schema Draft

This SQL is intentionally simple for MVP.

Claude Code can adapt it based on the actual Supabase setup.

```sql
create table app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text not null,
  name text,
  role text not null check (role in ('mentee', 'mentor', 'admin')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index app_users_email_unique on app_users (lower(email));
create unique index app_users_auth_user_id_unique on app_users (auth_user_id) where auth_user_id is not null;
create index app_users_role_idx on app_users (role);
create index app_users_status_idx on app_users (status);

create table mentor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references app_users(id) on delete set null,

  slug text not null unique,
  name text not null,

  photo_url text,
  role_title text,
  short_bio text,

  location_slugs text[] not null default '{}',
  discipline_slugs text[] not null default '{}',
  industry_slugs text[] not null default '{}',
  support_area_slugs text[] not null default '{}',

  what_i_can_help_with text,
  suitable_mentee_profile text,
  suggested_topics text,
  booking_instruction text,

  calendly_url text,
  calendly_url_updated_at timestamptz,
  calendly_url_updated_by uuid references app_users(id) on delete set null,

  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mentor_profiles_user_id_idx on mentor_profiles (user_id);
create index mentor_profiles_is_published_idx on mentor_profiles (is_published);
create index mentor_profiles_updated_at_idx on mentor_profiles (updated_at desc);

create index mentor_profiles_location_slugs_idx on mentor_profiles using gin (location_slugs);
create index mentor_profiles_discipline_slugs_idx on mentor_profiles using gin (discipline_slugs);
create index mentor_profiles_industry_slugs_idx on mentor_profiles using gin (industry_slugs);

create table filter_options (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('location', 'discipline', 'industry', 'support_area')),
  slug text not null,
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug)
);

create index filter_options_type_active_idx on filter_options (type, is_active);

create table app_config (
  key text primary key,
  value text,
  description text,
  updated_at timestamptz not null default now(),
  updated_by uuid references app_users(id) on delete set null
);
```

---

## 17. Suggested Seed Data

## 17.1 App Config

```sql
insert into app_config (key, value, description)
values
('feedback_form_url', '', 'External Google Form or Tally link for mentorship session feedback');
```

## 17.2 Filter Options

```sql
insert into filter_options (type, label, slug, sort_order) values
('location', 'Ho Chi Minh City', 'ho-chi-minh-city', 10),
('location', 'Hanoi', 'hanoi', 20),
('location', 'Vietnam', 'vietnam', 30),
('location', 'Singapore', 'singapore', 40),
('location', 'United States', 'united-states', 50),
('location', 'Remote / Online', 'remote-online', 60),

('discipline', 'Product Management', 'product-management', 10),
('discipline', 'UX Research', 'ux-research', 20),
('discipline', 'UI/UX Design', 'ui-ux-design', 30),
('discipline', 'Software Engineering', 'software-engineering', 40),
('discipline', 'Data Analytics', 'data-analytics', 50),
('discipline', 'Business Operations', 'business-operations', 60),
('discipline', 'Marketing', 'marketing', 70),
('discipline', 'Finance', 'finance', 80),
('discipline', 'Leadership', 'leadership', 90),
('discipline', 'Communication', 'communication', 100),
('discipline', 'Scholarship Preparation', 'scholarship-preparation', 110),
('discipline', 'Career Orientation', 'career-orientation', 120),

('industry', 'SaaS', 'saas', 10),
('industry', 'Technology', 'technology', 20),
('industry', 'Education', 'education', 30),
('industry', 'Non-profit / Community', 'non-profit-community', 40),
('industry', 'Start-up', 'start-up', 50),
('industry', 'Corporate', 'corporate', 60),
('industry', 'Consulting', 'consulting', 70),
('industry', 'Finance / Investment', 'finance-investment', 80),
('industry', 'Healthcare', 'healthcare', 90),
('industry', 'Manufacturing', 'manufacturing', 100),
('industry', 'E-commerce', 'e-commerce', 110),

('support_area', 'Career orientation', 'career-orientation', 10),
('support_area', 'Portfolio preparation', 'portfolio-preparation', 20),
('support_area', 'University application', 'university-application', 30),
('support_area', 'Scholarship preparation', 'scholarship-preparation', 40),
('support_area', 'Personal development', 'personal-development', 50),
('support_area', 'Leadership development', 'leadership-development', 60),
('support_area', 'Communication skills', 'communication-skills', 70),
('support_area', 'Study skills', 'study-skills', 80),
('support_area', 'Community work', 'community-work', 90),
('support_area', 'Early-career decision-making', 'early-career-decision-making', 100);
```

---

## 18. Example Mentor Profile

```text
mentor_profiles
- name: Nguyen A
- slug: nguyen-a
- role_title: Product Manager
- short_bio: Helps early-career students explore product and technology careers.
- location_slugs: ['ho-chi-minh-city', 'remote-online']
- discipline_slugs: ['product-management', 'ux-research']
- industry_slugs: ['saas', 'education']
- support_area_slugs: ['career-orientation', 'portfolio-preparation']
- what_i_can_help_with: Product career orientation, portfolio preparation, early-career decision-making.
- suitable_mentee_profile: Students interested in product, UX, SaaS, or technology.
- suggested_topics: Product portfolio, PM career path, internship preparation.
- calendly_url: https://calendly.com/example/pise-mentorship
- is_published: true
```

---

## 19. Query Patterns

## 19.1 Get Published Mentors

Fetch:

* published mentor profiles
* active filter options

Where:

```text
is_published = true
```

Sort:

```text
updated_at desc
```

or:

```text
name asc
```

## 19.2 Filter Mentors

For small MVP dataset, client-side filtering is acceptable.

Filter logic:

* location filter checks overlap with `location_slugs`
* discipline filter checks overlap with `discipline_slugs`
* industry filter checks overlap with `industry_slugs`
* OR within same group
* AND across groups

Example JavaScript logic:

```text
matchesLocation =
  selectedLocations.length === 0 ||
  mentor.location_slugs.some(slug => selectedLocations.includes(slug))

matchesDiscipline =
  selectedDisciplines.length === 0 ||
  mentor.discipline_slugs.some(slug => selectedDisciplines.includes(slug))

matchesIndustry =
  selectedIndustries.length === 0 ||
  mentor.industry_slugs.some(slug => selectedIndustries.includes(slug))

visible =
  matchesLocation && matchesDiscipline && matchesIndustry
```

## 19.3 Get Mentor Detail

Fetch by slug.

For mentee:

```text
slug = selected slug
AND is_published = true
```

For admin:

```text
slug = selected slug
```

For mentor owner:

```text
user_id = current app user id
```

## 19.4 Get Own Mentor Profile

Rules:

* logged-in user must be active
* role must be mentor
* profile must have `user_id = current app user id`

If no profile exists, show empty state:

```text
Your mentor profile is not connected yet.
Please contact the PISE team for support.
```

## 19.5 Update Own Mentor Profile

Rules:

* logged-in user must be active
* role must be mentor
* user must own linked mentor profile
* only mentor-owned fields can be updated
* URL must start with `https://` if provided

---

## 20. Data Model Completion Checklist

The data model is ready when:

* `app_users` supports invite-only access
* users have one primary role
* inactive users can be blocked
* `mentor_profiles` supports incomplete mentor profile drafts
* mentor profile content fields can be completed later by mentor
* mentor profiles can be linked to mentor users
* mentors can update their own profile content
* mentors can update their own Calendly link
* mentors cannot publish themselves
* admins can publish and unpublish mentors
* required fields are enforced at publish/completeness validation, not by excessive DB `NOT NULL`
* `filter_options` supports display labels and maintainable filter values
* filtering can work without a join table
* `app_config` or environment variable stores feedback form URL
* no booking table exists
* no availability table exists
* no session table exists
* no feedback response table exists
* no Calendly API/webhook dependency exists
