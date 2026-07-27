export type MentorProfileForStatus = {
  name: string | null
  role_title: string | null
  short_bio: string | null
  location_slugs: string[]
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

  if (!profile.role_title) missingFields.push('Chức danh / vai trò hiện tại')
  if (!profile.short_bio) missingFields.push('Giới thiệu ngắn')
  if (!profile.location_slugs?.length) missingFields.push('Địa điểm')
  if (!profile.industry_slugs?.length) missingFields.push('Chuyên môn')
  if (!profile.what_i_can_help_with) missingFields.push('Mentor có thể hỗ trợ gì')
  if (!profile.calendly_url?.startsWith('https://')) missingFields.push('Đường dẫn Calendly hợp lệ')

  return {
    isPublished: profile.is_published,
    isComplete: missingFields.length === 0,
    missingFields,
  }
}
