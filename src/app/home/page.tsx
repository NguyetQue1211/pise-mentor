import Link from 'next/link'
import { redirect } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import ProfileStatusCard from '@/components/ProfileStatusCard'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProfileStatus, type MentorProfileForStatus } from '@/lib/mentor/getProfileStatus'

// ─── Mentee ──────────────────────────────────────────────────────────────────

function MenteeHome() {
  const feedbackUrl = process.env.FEEDBACK_FORM_URL

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest">
          PISE Mentorship Portal
        </p>
        <h1 className="text-4xl font-bold text-neutral-900 leading-tight">
          Find the right mentor for your next step
        </h1>
        <p className="text-base text-neutral-600 leading-relaxed">
          Browse PISE mentors by location, discipline, and industry. Open a mentor
          profile to understand what they can help with before booking.
        </p>
      </div>

      <ol className="space-y-3">
        {[
          'Browse mentors and filter by what matters to you.',
          'Open a mentor profile to understand their background and focus.',
          'Prepare a few questions and context about what you want to discuss.',
          'Book a session through the mentor\'s Calendly link.',
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {i + 1}
            </span>
            <span className="text-sm text-neutral-600 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>

      <div className="flex flex-col sm:flex-row items-start gap-3">
        <Link
          href="/mentors"
          className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          Browse mentors
        </Link>

        {feedbackUrl && (
          <a
            href={feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Submit session feedback
          </a>
        )}
      </div>
    </main>
  )
}

// ─── Mentor ───────────────────────────────────────────────────────────────────

interface MentorHomeProps {
  appUserId: string
  userName: string | null
}

async function MentorHome({ appUserId, userName }: MentorHomeProps) {
  const feedbackUrl = process.env.FEEDBACK_FORM_URL

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('mentor_profiles')
    .select(
      'name, role_title, short_bio, location_slugs, discipline_slugs, industry_slugs, what_i_can_help_with, calendly_url, is_published'
    )
    .eq('user_id', appUserId)
    .maybeSingle()

  const greeting = userName ? `Welcome, ${userName.split(' ')[0]}` : 'Welcome back'

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest">
          Mentor
        </p>
        <h1 className="text-4xl font-bold text-neutral-900 leading-tight">
          {greeting}
        </h1>
        <p className="text-base text-neutral-600 leading-relaxed">
          Complete your profile so mentees can understand your background, what you can
          help with, and how to book time with you.
        </p>
      </div>

      {profile ? (
        <ProfileStatusCard status={getProfileStatus(profile as MentorProfileForStatus)} />
      ) : (
        <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-5">
          <p className="text-sm text-neutral-600">
            Your mentor profile is not connected yet. Please contact the PISE team for support.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start gap-3">
        <Link
          href="/mentor/profile"
          className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          Update my mentor profile
        </Link>

        {feedbackUrl && (
          <a
            href={feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Submit session feedback
          </a>
        )}
      </div>

      <p className="text-xs text-neutral-400 leading-relaxed">
        Availability and bookings are managed directly in Calendly. Keep your Calendly
        link updated so mentees can book with you.
      </p>
    </main>
  )
}

// ─── Admin ────────────────────────────────────────────────────────────────────

function AdminHome() {
  const feedbackUrl = process.env.FEEDBACK_FORM_URL

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest">
          Admin
        </p>
        <h1 className="text-4xl font-bold text-neutral-900 leading-tight">
          Manage the PISE mentorship portal
        </h1>
        <p className="text-base text-neutral-600 leading-relaxed">
          Review mentor readiness and control which mentor profiles are visible to mentees.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/mentors"
          className="group rounded-2xl border border-neutral-200 bg-white px-6 py-5 hover:border-primary-200 hover:bg-primary-50 transition-colors space-y-1.5"
        >
          <p className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
            Manage mentors
          </p>
          <p className="text-sm text-neutral-500">
            Create, edit, publish, and unpublish mentor profiles.
          </p>
        </Link>

        <Link
          href="/mentors"
          className="group rounded-2xl border border-neutral-200 bg-white px-6 py-5 hover:border-primary-200 hover:bg-primary-50 transition-colors space-y-1.5"
        >
          <p className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
            Open mentor list
          </p>
          <p className="text-sm text-neutral-500">
            Browse the published mentor directory as a mentee would see it.
          </p>
        </Link>
      </div>

      {feedbackUrl && (
        <a
          href={feedbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          Submit session feedback
        </a>
      )}
    </main>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <>
      <AppHeader role={user.role} userName={user.name ?? user.email} />

      {user.role === 'mentee' && <MenteeHome />}

      {user.role === 'mentor' && (
        <MentorHome appUserId={user.id} userName={user.name} />
      )}

      {user.role === 'admin' && <AdminHome />}
    </>
  )
}
