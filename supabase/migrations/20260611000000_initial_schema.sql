-- Migration: initial_schema
-- Tables: app_users, mentor_profiles, filter_options, app_config
-- Milestone 1 — PISE Mentorship Portal MVP

-- ============================================================
-- app_users
-- Acts as the invite-only whitelist for portal access.
-- A user can log in only when status = 'active'.
-- auth_user_id is nullable before the user's first login;
-- the application links it after successful magic-link auth.
-- ============================================================

create table public.app_users (
  id           uuid        primary key default gen_random_uuid(),
  auth_user_id uuid        references auth.users(id) on delete set null,
  email        text        not null,
  name         text,
  role         text        not null check (role in ('mentee', 'mentor', 'admin')),
  status       text        not null default 'active' check (status in ('active', 'inactive')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- case-insensitive unique email
create unique index app_users_email_unique
  on public.app_users (lower(email));

-- unique auth link, only enforced when not null
create unique index app_users_auth_user_id_unique
  on public.app_users (auth_user_id)
  where auth_user_id is not null;

create index app_users_role_idx   on public.app_users (role);
create index app_users_status_idx on public.app_users (status);

alter table public.app_users enable row level security;

-- ============================================================
-- RLS helper functions
-- Defined here so public.app_users already exists when these
-- are created. security definer lets them bypass RLS on
-- app_users when called from other policies (no recursion).
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.app_users
    where auth_user_id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

create or replace function public.is_active_user()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.app_users
    where auth_user_id = auth.uid()
      and status = 'active'
  );
$$;

-- Admin: full access to all rows
create policy "admin_all" on public.app_users
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Authenticated user: read own record only
create policy "user_read_own" on public.app_users
  for select
  to authenticated
  using (auth_user_id = auth.uid() and status = 'active');

-- ============================================================
-- mentor_profiles
-- Stores profile content, discovery attributes, publish state,
-- and Calendly URL. Supports incomplete drafts — most content
-- fields are nullable at DB level and validated only at
-- completeness check / publish time by the application.
-- ============================================================

create table public.mentor_profiles (
  id                      uuid        primary key default gen_random_uuid(),
  -- nullable until admin links a mentor user to this profile
  user_id                 uuid        references public.app_users(id) on delete set null,

  slug                    text        not null unique,
  name                    text        not null,

  photo_url               text,
  role_title              text,
  short_bio               text,

  -- stored as slug arrays; labels resolved from filter_options
  location_slugs          text[]      not null default '{}',
  discipline_slugs        text[]      not null default '{}',
  industry_slugs          text[]      not null default '{}',
  support_area_slugs      text[]      not null default '{}',

  what_i_can_help_with    text,
  suitable_mentee_profile text,
  suggested_topics        text,
  booking_instruction     text,

  calendly_url            text,
  calendly_url_updated_at timestamptz,
  -- tracks who last changed the Calendly link (mentor or admin)
  calendly_url_updated_by uuid        references public.app_users(id) on delete set null,

  is_published            boolean     not null default false,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index mentor_profiles_user_id_idx
  on public.mentor_profiles (user_id);

create index mentor_profiles_is_published_idx
  on public.mentor_profiles (is_published);

create index mentor_profiles_updated_at_idx
  on public.mentor_profiles (updated_at desc);

-- GIN indexes for array overlap queries used in mentor filtering
create index mentor_profiles_location_slugs_idx
  on public.mentor_profiles using gin (location_slugs);

create index mentor_profiles_discipline_slugs_idx
  on public.mentor_profiles using gin (discipline_slugs);

create index mentor_profiles_industry_slugs_idx
  on public.mentor_profiles using gin (industry_slugs);

alter table public.mentor_profiles enable row level security;

-- Admin: full access to all mentor profiles
create policy "admin_all" on public.mentor_profiles
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Active approved users: read published profiles only
create policy "active_users_read_published" on public.mentor_profiles
  for select
  to authenticated
  using (public.is_active_user() and is_published = true);

-- Mentor owner: read own profile regardless of published state
create policy "mentor_read_own" on public.mentor_profiles
  for select
  to authenticated
  using (
    exists (
      select 1 from public.app_users u
      where u.auth_user_id = auth.uid()
        and u.status = 'active'
        and u.role = 'mentor'
        and u.id = mentor_profiles.user_id
    )
  );

-- Mentor owner: update own profile row.
-- Which specific columns are writable is enforced by the
-- application (Server Actions), not here.
create policy "mentor_update_own" on public.mentor_profiles
  for update
  to authenticated
  using (
    exists (
      select 1 from public.app_users u
      where u.auth_user_id = auth.uid()
        and u.status = 'active'
        and u.role = 'mentor'
        and u.id = mentor_profiles.user_id
    )
  )
  with check (
    exists (
      select 1 from public.app_users u
      where u.auth_user_id = auth.uid()
        and u.status = 'active'
        and u.role = 'mentor'
        and u.id = mentor_profiles.user_id
    )
  );

-- ============================================================
-- filter_options
-- Stores allowed values and display labels for the three
-- mentor filter groups (location, discipline, industry) and
-- support areas (display tags only, not a filter in MVP).
-- Kept in a table so PISE can add values without code changes.
-- ============================================================

create table public.filter_options (
  id         uuid        primary key default gen_random_uuid(),
  type       text        not null check (type in ('location', 'discipline', 'industry', 'support_area')),
  slug       text        not null,
  label      text        not null,
  sort_order integer     not null default 0,
  is_active  boolean     not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug)
);

create index filter_options_type_active_idx
  on public.filter_options (type, is_active);

alter table public.filter_options enable row level security;

-- Admin: full access
create policy "admin_all" on public.filter_options
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Active approved users: read active options
create policy "active_users_read_active" on public.filter_options
  for select
  to authenticated
  using (public.is_active_user() and is_active = true);

-- ============================================================
-- app_config
-- Simple key-value store for app-level config.
-- MVP uses this for feedback_form_url.
-- ============================================================

create table public.app_config (
  key        text        primary key,
  value      text,
  description text,
  updated_at timestamptz not null default now(),
  updated_by uuid        references public.app_users(id) on delete set null
);

alter table public.app_config enable row level security;

-- Admin: full access
create policy "admin_all" on public.app_config
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Active approved users: read all config values
create policy "active_users_read" on public.app_config
  for select
  to authenticated
  using (public.is_active_user());
