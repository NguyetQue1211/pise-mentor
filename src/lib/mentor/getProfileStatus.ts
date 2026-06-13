export type MentorProfileForStatus = {
  name: string | null
  role_title: string | null
  short_bio: string | null
  location_slugs: string[]
  discipline_slugs: string[]
  industry_slugs: string[]
  what_i_can_help_with: string | null
  calendly_url: string | null
  is_published: boolean
}

export type ProfileStatus = {
  isPublished: boolean
  isComplete: boolean
  missingFields: string[]
}

export function getProfileStatus(profile: MentorProfileForStatus): ProfileStatus {
  const missingFields: string[] = []

  if (!profile.role_title) missingFields.push('Current role / title')
  if (!profile.short_bio) missingFields.push('Short bio')
  if (!profile.location_slugs?.length) missingFields.push('Location')
  if (!profile.discipline_slugs?.length) missingFields.push('Discipline')
  if (!profile.industry_slugs?.length) missingFields.push('Industry')
  if (!profile.what_i_can_help_with) missingFields.push('What I can help with')
  if (!profile.calendly_url?.startsWith('https://')) missingFields.push('Valid Calendly URL')

  return {
    isPublished: profile.is_published,
    isComplete: missingFields.length === 0,
    missingFields,
  }
}
