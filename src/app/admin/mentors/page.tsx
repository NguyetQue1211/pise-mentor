import { redirect } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export default async function AdminMentorsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/access-denied')

  return (
    <>
      <AppHeader role={user.role} userName={user.name ?? user.email} />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-lg space-y-4">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-neutral-900">
            Mentor management
          </h1>
          <p className="text-sm text-neutral-500">
            Signed in as <span className="font-medium text-neutral-700">{user.email}</span>
          </p>
          <p className="text-neutral-400 text-sm pt-4">
            Admin mentor list coming in Milestone 8.
          </p>
        </div>
      </main>
    </>
  )
}
