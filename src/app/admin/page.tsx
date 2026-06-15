import Link from 'next/link'
import { redirect } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/access-denied')

  return (
    <>
      <AppHeader role={user.role} userName={user.name ?? user.email} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Admin</p>
          <h1 className="text-2xl font-bold text-neutral-900">Manage the PISE mentorship portal</h1>
          <p className="text-sm text-neutral-500">
            Review mentor readiness and control which mentor profiles are visible to mentees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/mentors"
            className="rounded-2xl border border-neutral-200 bg-white px-6 py-5 space-y-1 hover:border-neutral-300 hover:shadow-sm transition-all"
          >
            <p className="text-sm font-semibold text-neutral-900">Manage mentors</p>
            <p className="text-xs text-neutral-400">
              Create profiles, review completeness, publish and unpublish.
            </p>
          </Link>

          <Link
            href="/mentors"
            className="rounded-2xl border border-neutral-200 bg-white px-6 py-5 space-y-1 hover:border-neutral-300 hover:shadow-sm transition-all"
          >
            <p className="text-sm font-semibold text-neutral-900">Browse mentor list</p>
            <p className="text-xs text-neutral-400">
              See the published mentor list as mentees see it.
            </p>
          </Link>
        </div>
      </main>
    </>
  )
}
