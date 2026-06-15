import Link from 'next/link'
import { redirect } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import AdminPublishToggle from '@/components/AdminPublishToggle'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProfileStatus, type MentorProfileForStatus } from '@/lib/mentor/getProfileStatus'

function linkedBadge(userId: string | null) {
  return userId ? (
    <span className="inline-flex items-center rounded-full bg-secondary-50 border border-secondary-100 px-2 py-0.5 text-[10px] font-semibold text-secondary-700">
      Linked
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-neutral-50 border border-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-400">
      Not linked
    </span>
  )
}

function completeBadge(isComplete: boolean) {
  return isComplete ? (
    <span className="inline-flex items-center rounded-full bg-secondary-50 border border-secondary-100 px-2 py-0.5 text-[10px] font-semibold text-secondary-700">
      Complete
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-warning-50 border border-warning-100 px-2 py-0.5 text-[10px] font-semibold text-warning-700">
      Incomplete
    </span>
  )
}

function calendlyBadge(url: string | null) {
  if (!url) {
    return (
      <span className="inline-flex items-center rounded-full bg-neutral-50 border border-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-400">
        Missing
      </span>
    )
  }
  if (!url.startsWith('https://')) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 border border-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
        Invalid
      </span>
    )
  }
  if (!url.includes('calendly.com')) {
    return (
      <span className="inline-flex items-center rounded-full bg-warning-50 border border-warning-100 px-2 py-0.5 text-[10px] font-semibold text-warning-700">
        Check link
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-secondary-50 border border-secondary-100 px-2 py-0.5 text-[10px] font-semibold text-secondary-700">
      Valid link
    </span>
  )
}

function publishedBadge(isPublished: boolean) {
  return isPublished ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary-50 border border-secondary-100 px-2 py-0.5 text-[10px] font-semibold text-secondary-700">
      <span className="w-1.5 h-1.5 rounded-full bg-secondary-500 inline-block" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 border border-warning-100 px-2 py-0.5 text-[10px] font-semibold text-warning-700">
      <span className="w-1.5 h-1.5 rounded-full bg-warning-500 inline-block" />
      Unpublished
    </span>
  )
}

export default async function AdminMentorsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/access-denied')

  const admin = createAdminClient()

  const { data: mentors } = await admin
    .from('mentor_profiles')
    .select(
      'id, name, slug, role_title, short_bio, user_id, location_slugs, discipline_slugs, industry_slugs, what_i_can_help_with, calendly_url, is_published, updated_at'
    )
    .order('updated_at', { ascending: false })

  const rows = (mentors ?? []).map((m) => {
    const statusInput: MentorProfileForStatus = {
      name: m.name,
      role_title: m.role_title ?? null,
      short_bio: m.short_bio ?? null,
      location_slugs: m.location_slugs ?? [],
      discipline_slugs: m.discipline_slugs ?? [],
      industry_slugs: m.industry_slugs ?? [],
      what_i_can_help_with: m.what_i_can_help_with ?? null,
      calendly_url: m.calendly_url ?? null,
      is_published: m.is_published,
    }
    const status = getProfileStatus(statusInput)
    return { ...m, isComplete: status.isComplete }
  })

  return (
    <>
      <AppHeader role={user.role} userName={user.name ?? user.email} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Admin</p>
            <h1 className="text-2xl font-bold text-neutral-900">Mentor management</h1>
          </div>
          <Link
            href="/admin/mentors/new"
            className="shrink-0 inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            Create mentor profile
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-12 text-center space-y-3">
            <p className="text-sm font-medium text-neutral-900">
              No mentor profiles have been created yet.
            </p>
            <p className="text-sm text-neutral-400">
              Create the first mentor profile to get started.
            </p>
            <Link
              href="/admin/mentors/new"
              className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors mt-2"
            >
              Create mentor profile
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Mentor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wide hidden sm:table-cell">
                    Linked
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wide hidden md:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wide hidden md:table-cell">
                    Calendly
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Published
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wide hidden lg:table-cell">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((m) => (
                  <tr key={m.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-900 text-sm">{m.name}</p>
                      {m.role_title && (
                        <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                          {m.role_title}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
                        {linkedBadge(m.user_id)}
                        {completeBadge(m.isComplete)}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {linkedBadge(m.user_id)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {completeBadge(m.isComplete)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {calendlyBadge(m.calendly_url)}
                    </td>
                    <td className="px-4 py-3">
                      {publishedBadge(m.is_published)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-neutral-400">
                      {new Date(m.updated_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/mentors/${m.id}/edit`}
                          className="inline-flex items-center rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          Edit
                        </Link>
                        <AdminPublishToggle
                          id={m.id}
                          isPublished={m.is_published}
                          isComplete={m.isComplete}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  )
}
