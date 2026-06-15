'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createAdminClient } from '@/lib/supabase/admin'

export type UpdateProfileData = {
  photo_url: string
  role_title: string
  short_bio: string
  location_slugs: string[]
  discipline_slugs: string[]
  industry_slugs: string[]
  support_area_slugs: string[]
  what_i_can_help_with: string
  suitable_mentee_profile: string
  suggested_topics: string
  booking_instruction: string
  calendly_url: string
}

export type UpdateProfileResult = {
  success: boolean
  error?: string
  calendlyWarning?: boolean
}

export async function updateOwnMentorProfile(
  data: UpdateProfileData
): Promise<UpdateProfileResult> {
  const user = await getCurrentUser()
  if (!user || user.role !== 'mentor') {
    return { success: false, error: 'Unauthorized.' }
  }

  if (data.calendly_url && !data.calendly_url.startsWith('https://')) {
    return { success: false, error: 'Please enter a valid URL starting with https://.' }
  }

  const calendlyWarning =
    !!data.calendly_url && !data.calendly_url.includes('calendly.com')

  const admin = createAdminClient()

  const { data: current } = await admin
    .from('mentor_profiles')
    .select('id, calendly_url')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!current) {
    return { success: false, error: 'Mentor profile not found.' }
  }

  const calendlyChanged = data.calendly_url !== (current.calendly_url ?? '')

  const payload: Record<string, unknown> = {
    photo_url: data.photo_url || null,
    role_title: data.role_title || null,
    short_bio: data.short_bio || null,
    location_slugs: data.location_slugs,
    discipline_slugs: data.discipline_slugs,
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
    .eq('id', current.id)

  if (error) {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  revalidatePath('/mentor/profile')
  return { success: true, calendlyWarning }
}
