import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import AppHeader from '@/components/AppHeader'
import MentorTag from '@/components/MentorTag'
import CalendlyButton from '@/components/CalendlyButton'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ slug: string }>
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

interface Section {
  heading: string
  content: string
}

export default async function MentorProfilePage({ params }: Props) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { slug } = await params
  const supabase = await createClient()

  const [{ data: profile }, { data: filterRows }] = await Promise.all([
    supabase
      .from('mentor_profiles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle(),
    supabase
      .from('filter_options')
      .select('type, slug, label')
      .eq('is_active', true),
  ])

  if (!profile) notFound()

  const labelMap: Record<string, string> = {}
  for (const row of filterRows ?? []) {
    labelMap[row.slug] = row.label
  }
  const label = (s: string) => labelMap[s] ?? s

  const feedbackUrl = process.env.FEEDBACK_FORM_URL
  const hasCalendly = !!profile.calendly_url?.startsWith('https://')

  const sections: Section[] = [
    { heading: 'Giới thiệu về mentor', content: profile.short_bio },
    { heading: 'Mentor có thể hỗ trợ gì', content: profile.what_i_can_help_with },
    { heading: 'Phù hợp với ai', content: profile.suitable_mentee_profile },
    { heading: 'Chủ đề gợi ý để trao đổi', content: profile.suggested_topics },
    { heading: 'Hướng dẫn đặt lịch', content: profile.booking_instruction },
  ].filter((s): s is Section => !!s.content)

  return (
    <>
      <AppHeader role={user.role} userName={user.name ?? user.email} />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">

        {/* Unpublished banner */}
        {!profile.is_published && (user.role === 'admin' || user.role === 'mentor') && (
          <div className="rounded-xl bg-warning-50 border border-warning-100 px-4 py-3">
            <p className="text-sm font-medium text-warning-700">
              Hồ sơ này chưa được công khai — chỉ bạn mới xem được.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="shrink-0">
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt={profile.name}
                className="w-28 h-28 rounded-2xl object-cover object-top bg-neutral-100"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <span className="text-3xl font-bold text-white/80">
                  {getInitials(profile.name)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 leading-tight">
                {profile.name}
              </h1>
              {profile.role_title && (
                <p className="text-base text-neutral-500 mt-0.5">{profile.role_title}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(profile.location_slugs ?? []).map((s: string) => (
                <MentorTag key={s} label={label(s)} variant="location" />
              ))}
              {(profile.industry_slugs ?? []).map((s: string) => (
                <MentorTag key={s} label={label(s)} variant="industry" />
              ))}
              {(profile.support_area_slugs ?? []).map((s: string) => (
                <MentorTag key={s} label={label(s)} variant="support_area" />
              ))}
            </div>
          </div>
        </div>

        {/* Content sections */}
        {sections.length > 0 && (
          <div className="border-t border-neutral-200 pt-8 space-y-7">
            {sections.map((s) => (
              <section key={s.heading} className="space-y-2">
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                  {s.heading}
                </h2>
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                  {s.content}
                </p>
              </section>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="border-t border-neutral-200 pt-6 space-y-4">
          <CalendlyButton url={hasCalendly ? profile.calendly_url : undefined} />

          {feedbackUrl && (
            <a
              href={feedbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Gửi phản hồi buổi mentoring
            </a>
          )}
        </div>

        <Link
          href="/mentors"
          className="inline-block text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          ← Quay lại danh sách mentor
        </Link>
      </main>
    </>
  )
}
