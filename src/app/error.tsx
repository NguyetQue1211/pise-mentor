'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-neutral-50">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-sm px-8 py-10 space-y-6 text-center">
        <p className="text-sm font-bold text-primary-600 uppercase tracking-widest">
          PISE Mentors
        </p>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-neutral-900">Something went wrong</h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            An unexpected error occurred. Please try again or go back to the home page.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            Try again
          </button>
          <a
            href="/home"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  )
}
