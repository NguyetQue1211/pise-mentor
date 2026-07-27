import { redirect } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import BookingStepsAccordion from '@/components/BookingStepsAccordion'
import MentorBrowser from './MentorBrowser'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createClient } from '@/lib/supabase/server'
import type { MentorCardData } from '@/components/MentorCard'

export default async function MentorsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()

  const [{ data: mentorRows }, { data: filterRows }] = await Promise.all([
    supabase
      .from('mentor_profiles')
      .select(
        'id, slug, name, photo_url, role_title, short_bio, location_slugs, industry_slugs, support_area_slugs'
      )
      .eq('is_published', true)
      .order('name', { ascending: true }),
    supabase
      .from('filter_options')
      .select('type, slug, label')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])

  const mentors: MentorCardData[] = (mentorRows ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    photo_url: row.photo_url ?? null,
    role_title: row.role_title ?? null,
    short_bio: row.short_bio ?? null,
    location_slugs: row.location_slugs ?? [],
    industry_slugs: row.industry_slugs ?? [],
    support_area_slugs: row.support_area_slugs ?? [],
  }))

  const rows = filterRows ?? []
  const filterOptions = {
    locations: rows
      .filter((r) => r.type === 'location')
      .map((r) => ({ slug: r.slug, label: r.label })),
    industries: rows
      .filter((r) => r.type === 'industry')
      .map((r) => ({ slug: r.slug, label: r.label })),
    supportAreas: rows
      .filter((r) => r.type === 'support_area')
      .map((r) => ({ slug: r.slug, label: r.label })),
  }

  return (
    <>
      <AppHeader role={user.role} userName={user.name ?? user.email} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-neutral-900">Hãy kết nối và trò chuyện cùng PISE mentor</h1>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
              Đôi khi, một cuộc trò chuyện đúng người, đúng thời điểm có thể tạo nên sự khác
              biệt. Khám phá hồ sơ các Expert Mentors đang đồng hành cùng PISE — những anh/chị
              sẵn sàng lắng nghe, chia sẻ và cùng bạn tìm hướng đi cho những câu hỏi, thử thách
              trên hành trình phát triển bản thân.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">
              Chưa biết bắt đầu từ đâu?
              <br />
              Chỉ cần 3 bước đơn giản!
            </h2>

            <BookingStepsAccordion />
          </div>
        </div>

        <MentorBrowser mentors={mentors} filterOptions={filterOptions} />
      </main>
    </>
  )
}
