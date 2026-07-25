import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import AdminMentorForm from '@/components/AdminMentorForm'
import ProfileStatusCard from '@/components/ProfileStatusCard'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProfileStatus, type MentorProfileForStatus } from '@/lib/mentor/getProfileStatus'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminMentorEditPage({ params }: Props) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/access-denied')

  const { id } = await params

  const admin = createAdminClient()

  const [{ data: profile }, { data: filterRows }, { data: mentorUserRows }] = await Promise.all([
    admin
      .from('mentor_profiles')
      .select(`
        id, name, slug, photo_url, role_title, short_bio,
        location_slugs, discipline_slugs, industry_slugs, support_area_slugs,
        what_i_can_help_with, suitable_mentee_profile, suggested_topics,
        booking_instruction, calendly_url, user_id, is_published
      `)
      .eq('id', id)
      .maybeSingle(),
    admin
      .from('filter_options')
      .select('type, slug, label')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    admin
      .from('app_users')
      .select('id, name, email')
      .eq('role', 'mentor')
      .eq('status', 'active')
      .order('name', { ascending: true }),
  ])

  if (!profile) notFound()

  const rows = filterRows ?? []
  const filterOptions = {
    locations: rows.filter((r) => r.type === 'location').map((r) => ({ slug: r.slug, label: r.label })),
    disciplines: rows.filter((r) => r.type === 'discipline').map((r) => ({ slug: r.slug, label: r.label })),
    industries: rows.filter((r) => r.type === 'industry').map((r) => ({ slug: r.slug, label: r.label })),
    supportAreas: rows.filter((r) => r.type === 'support_area').map((r) => ({ slug: r.slug, label: r.label })),
  }

  const mentorUsers = (mentorUserRows ?? []).map((u) => ({
    id: u.id,
    name: u.name ?? null,
    email: u.email,
  }))

  const statusInput: MentorProfileForStatus = {
    name: profile.name,
    role_title: profile.role_title ?? null,
    short_bio: profile.short_bio ?? null,
    location_slugs: profile.location_slugs ?? [],
    discipline_slugs: profile.discipline_slugs ?? [],
    industry_slugs: profile.industry_slugs ?? [],
    what_i_can_help_with: profile.what_i_can_help_with ?? null,
    calendly_url: profile.calendly_url ?? null,
    is_published: profile.is_published,
  }

  return (
    <>
      <AppHeader role={user.role} userName={user.name ?? user.email} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10 space-y-6">
        <div className="space-y-1">
          <Link
            href="/admin/mentors"
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ← Quay lại quản lý mentor
          </Link>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest pt-2">
            Admin
          </p>
          <h1 className="text-2xl font-bold text-neutral-900">{profile.name}</h1>
          <p className="text-xs font-mono text-neutral-400">/mentors/{profile.slug}</p>
        </div>

        <ProfileStatusCard status={getProfileStatus(statusInput)} />

        <AdminMentorForm
          mode="edit"
          profile={{
            id: profile.id,
            name: profile.name,
            slug: profile.slug,
            user_id: profile.user_id ?? '',
            photo_url: profile.photo_url ?? '',
            role_title: profile.role_title ?? '',
            short_bio: profile.short_bio ?? '',
            location_slugs: profile.location_slugs ?? [],
            discipline_slugs: profile.discipline_slugs ?? [],
            industry_slugs: profile.industry_slugs ?? [],
            support_area_slugs: profile.support_area_slugs ?? [],
            what_i_can_help_with: profile.what_i_can_help_with ?? '',
            suitable_mentee_profile: profile.suitable_mentee_profile ?? '',
            suggested_topics: profile.suggested_topics ?? '',
            booking_instruction: profile.booking_instruction ?? '',
            calendly_url: profile.calendly_url ?? '',
            is_published: profile.is_published,
          }}
          filterOptions={filterOptions}
          mentorUsers={mentorUsers}
        />
      </main>
    </>
  )
}
