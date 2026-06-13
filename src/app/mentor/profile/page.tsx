import { redirect } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import ProfileStatusCard from '@/components/ProfileStatusCard'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProfileStatus, type MentorProfileForStatus } from '@/lib/mentor/getProfileStatus'

export default async function MentorProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'mentor') redirect('/access-denied')

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from('mentor_profiles')
    .select('id, name, role_title, short_bio, location_slugs, discipline_slugs, industry_slugs, what_i_can_help_with, calendly_url, is_published')
    .eq('user_id', user.id)
    .maybeSingle()

  const bookings = profile
    ? await admin
        .from('booking_intents')
        .select('id, booked_at, mentee:mentee_user_id(name, email)')
        .eq('mentor_profile_id', profile.id)
        .order('booked_at', { ascending: false })
        .limit(50)
        .then(({ data }) => data ?? [])
    : []

  return (
    <>
      <AppHeader role={user.role} userName={user.name ?? user.email} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Mentor</p>
          <h1 className="text-2xl font-bold text-neutral-900">My mentor profile</h1>
        </div>

        {profile ? (
          <>
            <ProfileStatusCard status={getProfileStatus(profile as MentorProfileForStatus)} />

            {/* Bookings */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-neutral-900">Recent bookings</h2>

              {bookings.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  No bookings yet. Bookings will appear here when mentees schedule with you.
                </p>
              ) : (
                <div className="rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-100">
                  {bookings.map((b: any) => {
                    const mentee = b.mentee as { name: string | null; email: string } | null
                    const name = mentee?.name ?? mentee?.email ?? 'Unknown'
                    const date = new Date(b.booked_at)
                    return (
                      <div key={b.id} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{name}</p>
                          {mentee?.name && (
                            <p className="text-xs text-neutral-400">{mentee.email}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-xs text-neutral-500">
                            {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            <p className="text-xs text-neutral-400">
              Profile editing coming soon. Contact PISE admin to update your profile content.
            </p>
          </>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-5">
            <p className="text-sm text-neutral-600">
              Your mentor profile is not connected yet. Please contact the PISE team for support.
            </p>
          </div>
        )}
      </main>
    </>
  )
}
