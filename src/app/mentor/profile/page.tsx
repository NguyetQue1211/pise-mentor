import { redirect } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import MentorProfileForm, { type MentorProfileFormData } from '@/components/MentorProfileForm'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function MentorProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'mentor') redirect('/access-denied')

  const admin = createAdminClient()

  const [{ data: profile }, { data: filterRows }] = await Promise.all([
    admin
      .from('mentor_profiles')
      .select(`
        id, name, photo_url, role_title, short_bio,
        location_slugs, discipline_slugs, industry_slugs, support_area_slugs,
        what_i_can_help_with, suitable_mentee_profile, suggested_topics,
        booking_instruction, calendly_url, is_published
      `)
      .eq('user_id', user.id)
      .maybeSingle(),
    admin
      .from('filter_options')
      .select('type, slug, label')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])

  const rows = filterRows ?? []
  const filterOptions = {
    locations: rows.filter((r) => r.type === 'location').map((r) => ({ slug: r.slug, label: r.label })),
    disciplines: rows.filter((r) => r.type === 'discipline').map((r) => ({ slug: r.slug, label: r.label })),
    industries: rows.filter((r) => r.type === 'industry').map((r) => ({ slug: r.slug, label: r.label })),
    supportAreas: rows.filter((r) => r.type === 'support_area').map((r) => ({ slug: r.slug, label: r.label })),
  }

  return (
    <>
      <AppHeader role={user.role} userName={user.name ?? user.email} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Mentor</p>
          <h1 className="text-2xl font-bold text-neutral-900">Hồ sơ mentor của tôi</h1>
        </div>

        {profile ? (
          <MentorProfileForm
            profile={profile as MentorProfileFormData}
            filterOptions={filterOptions}
          />
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-5">
            <p className="text-sm text-neutral-600">
              Hồ sơ mentor của bạn chưa được liên kết. Vui lòng liên hệ đội ngũ PISE để được hỗ trợ.
            </p>
          </div>
        )}
      </main>
    </>
  )
}
