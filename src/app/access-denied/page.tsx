import Link from 'next/link'

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-neutral-50">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-sm px-8 py-10 space-y-6 text-center">
        <p className="text-sm font-bold text-primary-600 uppercase tracking-widest">
          PISE Mentors
        </p>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-neutral-900">Access denied</h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            This portal is currently available only for approved PISE mentors and mentees.
            If you believe you should have access, please contact the PISE team.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          Back to login
        </Link>
      </div>
    </main>
  )
}
