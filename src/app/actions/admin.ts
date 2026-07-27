'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProfileStatus, type MentorProfileForStatus } from '@/lib/mentor/getProfileStatus'

export type AdminProfileData = {
  name: string
  slug: string
  user_id: string
  photo_url: string
  role_title: string
  short_bio: string
  location_slugs: string[]
  industry_slugs: string[]
  support_area_slugs: string[]
  what_i_can_help_with: string
  suitable_mentee_profile: string
  suggested_topics: string
  booking_instruction: string
  calendly_url: string
}

export type AdminActionResult = {
  success: boolean
  error?: string
  calendlyWarning?: boolean
  missingFields?: string[]
  id?: string
}

async function assertAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') return null
  return user
}

function validateSlug(slug: string): string | null {
  if (!slug.trim()) return 'Slug is required.'
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return 'Slug must only contain lowercase letters, numbers, and hyphens.'
  }
  return null
}

export async function createMentorProfile(
  data: AdminProfileData
): Promise<AdminActionResult> {
  const user = await assertAdmin()
  if (!user) return { success: false, error: 'Unauthorized.' }

  if (!data.name.trim()) return { success: false, error: 'Mentor name is required.' }

  const slugError = validateSlug(data.slug)
  if (slugError) return { success: false, error: slugError }

  if (data.calendly_url && !data.calendly_url.startsWith('https://')) {
    return { success: false, error: 'Calendly URL must start with https://.' }
  }

  const admin = createAdminClient()

  const { data: created, error } = await admin
    .from('mentor_profiles')
    .insert({
      name: data.name.trim(),
      slug: data.slug.trim(),
      user_id: data.user_id || null,
      photo_url: data.photo_url || null,
      role_title: data.role_title || null,
      short_bio: data.short_bio || null,
      location_slugs: data.location_slugs,
      industry_slugs: data.industry_slugs,
      support_area_slugs: data.support_area_slugs,
      what_i_can_help_with: data.what_i_can_help_with || null,
      suitable_mentee_profile: data.suitable_mentee_profile || null,
      suggested_topics: data.suggested_topics || null,
      booking_instruction: data.booking_instruction || null,
      calendly_url: data.calendly_url || null,
      is_published: false,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'A mentor profile with this slug already exists.' }
    }
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  revalidatePath('/admin/mentors')
  return { success: true, id: created.id }
}

export async function updateMentorProfile(
  id: string,
  data: AdminProfileData
): Promise<AdminActionResult> {
  const user = await assertAdmin()
  if (!user) return { success: false, error: 'Unauthorized.' }

  if (!data.name.trim()) return { success: false, error: 'Mentor name is required.' }

  const slugError = validateSlug(data.slug)
  if (slugError) return { success: false, error: slugError }

  if (data.calendly_url && !data.calendly_url.startsWith('https://')) {
    return { success: false, error: 'Calendly URL must start with https://.' }
  }

  const admin = createAdminClient()

  const { data: current } = await admin
    .from('mentor_profiles')
    .select('calendly_url, is_published')
    .eq('id', id)
    .maybeSingle()

  if (!current) return { success: false, error: 'Mentor profile not found.' }

  // Block saves that would make a published mentor incomplete
  if (current.is_published) {
    const check: MentorProfileForStatus = {
      name: data.name.trim(),
      role_title: data.role_title || null,
      short_bio: data.short_bio || null,
      location_slugs: data.location_slugs,
      industry_slugs: data.industry_slugs,
      what_i_can_help_with: data.what_i_can_help_with || null,
      calendly_url: data.calendly_url || null,
      is_published: true,
    }
    const status = getProfileStatus(check)
    if (!status.isComplete) {
      return {
        success: false,
        error: `Cannot save: would make a published mentor incomplete. Missing: ${status.missingFields.join(', ')}.`,
        missingFields: status.missingFields,
      }
    }
  }

  const calendlyChanged = data.calendly_url !== (current.calendly_url ?? '')
  const calendlyWarning = !!data.calendly_url && !data.calendly_url.includes('calendly.com')

  const payload: Record<string, unknown> = {
    name: data.name.trim(),
    slug: data.slug.trim(),
    user_id: data.user_id || null,
    photo_url: data.photo_url || null,
    role_title: data.role_title || null,
    short_bio: data.short_bio || null,
    location_slugs: data.location_slugs,
    industry_slugs: data.industry_slugs,
    support_area_slugs: data.support_area_slugs,
    what_i_can_help_with: data.what_i_can_help_with || null,
    suitable_mentee_profile: data.suitable_mentee_profile || null,
    suggested_topics: data.suggested_topics || null,
    booking_instruction: data.booking_instruction || null,
    calendly_url: data.calendly_url || null,
    updated_at: new Date().toISOString(),
  }

  if (calendlyChanged) {
    payload.calendly_url_updated_at = new Date().toISOString()
    payload.calendly_url_updated_by = user.id
  }

  const { error } = await admin
    .from('mentor_profiles')
    .update(payload)
    .eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'A mentor profile with this slug already exists.' }
    }
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  revalidatePath('/admin/mentors')
  revalidatePath(`/admin/mentors/${id}/edit`)
  revalidatePath('/mentors')
  return { success: true, calendlyWarning }
}

export async function publishMentor(id: string): Promise<AdminActionResult> {
  const user = await assertAdmin()
  if (!user) return { success: false, error: 'Unauthorized.' }

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from('mentor_profiles')
    .select(
      'name, role_title, short_bio, location_slugs, industry_slugs, what_i_can_help_with, calendly_url, is_published'
    )
    .eq('id', id)
    .maybeSingle()

  if (!profile) return { success: false, error: 'Mentor profile not found.' }
  if (profile.is_published) return { success: true }

  const status = getProfileStatus({ ...(profile as MentorProfileForStatus), is_published: false })
  if (!status.isComplete) {
    return {
      success: false,
      error: `Cannot publish. Missing: ${status.missingFields.join(', ')}.`,
      missingFields: status.missingFields,
    }
  }

  const calendlyWarning = !!profile.calendly_url && !profile.calendly_url.includes('calendly.com')

  const { error } = await admin
    .from('mentor_profiles')
    .update({ is_published: true, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { success: false, error: 'Something went wrong. Please try again.' }

  revalidatePath('/admin/mentors')
  revalidatePath(`/admin/mentors/${id}/edit`)
  revalidatePath('/mentors')
  return { success: true, calendlyWarning }
}

export async function deleteMentorProfile(id: string): Promise<AdminActionResult> {
  const user = await assertAdmin()
  if (!user) return { success: false, error: 'Unauthorized.' }

  const admin = createAdminClient()

  const { error } = await admin.from('mentor_profiles').delete().eq('id', id)

  if (error) return { success: false, error: 'Something went wrong. Please try again.' }

  revalidatePath('/admin/mentors')
  revalidatePath('/mentors')
  return { success: true }
}

export async function unpublishMentor(id: string): Promise<AdminActionResult> {
  const user = await assertAdmin()
  if (!user) return { success: false, error: 'Unauthorized.' }

  const admin = createAdminClient()

  const { error } = await admin
    .from('mentor_profiles')
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { success: false, error: 'Something went wrong. Please try again.' }

  revalidatePath('/admin/mentors')
  revalidatePath(`/admin/mentors/${id}/edit`)
  revalidatePath('/mentors')
  return { success: true }
}

const MAX_PHOTO_SIZE = 5 * 1024 * 1024 // 5MB
const PHOTO_EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export type UploadPhotoResult =
  | { success: true; url: string }
  | { success: false; error: string }

export async function uploadMentorPhotoAsAdmin(
  formData: FormData,
  linkedUserId: string
): Promise<UploadPhotoResult> {
  const user = await assertAdmin()
  if (!user) return { success: false, error: 'Unauthorized.' }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'No file provided.' }
  }

  const ext = PHOTO_EXT_BY_MIME[file.type]
  if (!ext) {
    return { success: false, error: 'Please upload a JPG, PNG, or WebP image.' }
  }

  if (file.size > MAX_PHOTO_SIZE) {
    return { success: false, error: 'Image must be 5MB or smaller.' }
  }

  const admin = createAdminClient()

  // Keyed by the linked mentor account when there is one, so an admin-set
  // photo overwrites/gets overwritten by the mentor's own uploads at the
  // same deterministic path. Drafts not yet linked to a mentor account fall
  // back to a random path under admin-drafts/.
  const path = linkedUserId
    ? `${linkedUserId}/avatar.${ext}`
    : `admin-drafts/${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await admin.storage
    .from('mentor-photos')
    .upload(path, file, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('[uploadMentorPhotoAsAdmin] storage error:', uploadError.message)
    return { success: false, error: 'Upload failed. Please try again.' }
  }

  const { data: publicUrlData } = admin.storage.from('mentor-photos').getPublicUrl(path)

  const url = `${publicUrlData.publicUrl}?v=${Date.now()}`

  return { success: true, url }
}
