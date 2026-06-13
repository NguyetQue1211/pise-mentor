'use client'

import { useState } from 'react'
import { requestLoginLink } from '@/app/actions/auth'
import ErrorMessage from '@/components/ErrorMessage'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()

    // Guard: prevent re-entry if a request is already in flight
    if (status === 'loading') return

    setErrorMsg('')

    const trimmed = email.trim()

    if (!isValidEmail(trimmed)) {
      setErrorMsg('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setStatus('loading')

    const result = await requestLoginLink(trimmed)

    if (!result.success) {
      setErrorMsg(result.message)
      setStatus('error')
      return
    }

    setStatus('success')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-neutral-50">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-sm px-8 py-10 space-y-8">

        <p className="text-sm font-bold text-primary-600 uppercase tracking-widest">
          PISE Mentors
        </p>

        {status === 'success' ? (
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-neutral-900">
              Check your inbox
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We sent a login link to{' '}
              <span className="font-medium text-neutral-900">{email.trim()}</span>.
              Click the link in the email to sign in.
            </p>
            <p className="text-xs text-neutral-400">
              No email? Check your spam folder or{' '}
              <button
                onClick={() => {
                  setStatus('idle')
                  setErrorMsg('')
                }}
                className="underline hover:text-neutral-600 transition-colors"
              >
                try again
              </button>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-neutral-900">
                Welcome to PISE Mentorship Portal
              </h1>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Sign in with your approved email to explore mentors and manage
                your mentorship journey.
              </p>
            </div>

            {status === 'error' && errorMsg && (
              <ErrorMessage message={errorMsg} />
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                disabled={status === 'loading'}
                className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-50 disabled:text-neutral-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? 'Sending…' : 'Send login link'}
            </button>

            <p className="text-xs text-neutral-400 text-center leading-relaxed">
              This portal is only available for approved PISE mentors, mentees,
              and team members.
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
