import Link from 'next/link'
import { redirect } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import AdminMentorForm from '@/components/AdminMentorForm'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminMentorsNewPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/access-denied')

  const admin = createAdminClient()

  const [{ data: filterRows }, { data: mentorUserRows }] = await Promise.all([
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

  return (
    <>
      <AppHeader role={user.role} userName={user.name ?? user.email} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10 space-y-6">
        <div className="space-y-1">
          <Link
            href="/admin/mentors"
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ← Back to mentor management
          </Link>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest pt-2">
            Admin
          </p>
          <h1 className="text-2xl font-bold text-neutral-900">Create mentor profile draft</h1>
          <p className="text-sm text-neutral-500">
            Create an unpublished mentor profile draft. The mentor can complete it after logging in.
          </p>
        </div>

        <AdminMentorForm
          mode="create"
          filterOptions={filterOptions}
          mentorUsers={mentorUsers}
        />
      </main>
    </>
  )
}
