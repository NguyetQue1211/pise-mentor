-- Migration: mentor_photos_bucket
-- Adds Supabase Storage support for mentor profile photo uploads.
-- Supersedes the original MVP decision in docs/03_DATA_MODEL.md §2.5
-- to only accept a pasted external image URL.

-- ============================================================
-- mentor-photos bucket
--
-- public = true: objects are served directly via the public URL
-- (storage/v1/object/public/mentor-photos/...) with no auth check —
-- this is what makes reads public, not an RLS policy.
--
-- All writes (insert/update/delete) happen only through the
-- server-side admin client (service role key, see
-- src/lib/supabase/admin.ts), which bypasses storage.objects RLS
-- entirely — the same trust model already used for every other
-- write in this app (see docs/03_DATA_MODEL.md §14.4). As a result,
-- no storage.objects RLS policies need to be created here.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mentor-photos',
  'mentor-photos',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public              = excluded.public,
  file_size_limit     = excluded.file_size_limit,
  allowed_mime_types  = excluded.allowed_mime_types;
