'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { requestLoginLink, verifyLoginCode } from '@/app/actions/auth'
import ErrorMessage from '@/components/ErrorMessage'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

type Step = 'email' | 'code'
type Status = 'idle' | 'loading' | 'error'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSendCode(e: { preventDefault(): void }) {
    e.preventDefault()

    if (status === 'loading') return

    setErrorMsg('')

    const trimmed = email.trim()

    if (!isValidEmail(trimmed)) {
      setErrorMsg('Vui lòng nhập một địa chỉ email hợp lệ.')
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

    setStatus('idle')
    setStep('code')
  }

  async function handleVerifyCode(e: { preventDefault(): void }) {
    e.preventDefault()

    if (status === 'loading') return

    setErrorMsg('')

    const trimmedCode = code.trim()

    if (trimmedCode.length < 4) {
      setErrorMsg('Vui lòng nhập mã xác thực từ email.')
      setStatus('error')
      return
    }

    setStatus('loading')

    const result = await verifyLoginCode(email.trim(), trimmedCode)

    if (!result.success) {
      setErrorMsg(result.message)
      setStatus('error')
      return
    }

    router.push('/mentors')
    router.refresh()
  }

  function handleChangeEmail() {
    setStep('email')
    setCode('')
    setStatus('idle')
    setErrorMsg('')
  }

  return (
    <main className="min-h-screen flex flex-col bg-neutral-50">
      {/* Top bar */}
      <header className="bg-white shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <span className="flex items-center gap-2 text-base font-bold text-neutral-900 tracking-tight">
              <img src="/logo.jpeg" alt="PISE" className="h-7 w-7 rounded-md object-cover" />
              PISE Mentors
            </span>
          </div>
        </div>
        <div className="h-[3px] bg-gradient-secondary" />
      </header>

      {/* Hero with cover background */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-16 overflow-hidden">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center blur-md"
          style={{ backgroundImage: "url('/login-cover.jpg')" }}
        />
        <div className="absolute inset-0 bg-white/25" />

        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10 space-y-8">

          {step === 'email' ? (
            <form onSubmit={handleSendCode} noValidate className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-neutral-900">
                  Chào mừng đến với PISE Mentorship Portal
                </h1>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Đăng nhập bằng email đã được phê duyệt để khám phá mentor và
                  quản lý hành trình mentorship của bạn.
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
                  Địa chỉ email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ban@example.com"
                  autoComplete="email"
                  inputMode="email"
                  disabled={status === 'loading'}
                  className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-50 disabled:text-neutral-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-white hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-[filter]"
              >
                {status === 'loading' ? 'Đang gửi…' : 'Gửi mã đăng nhập'}
              </button>

              <p className="text-xs text-neutral-400 text-center leading-relaxed">
                Portal này chỉ dành cho mentor, mentee và thành viên PISE đã được
                phê duyệt.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} noValidate className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-neutral-900">
                  Nhập mã xác thực
                </h1>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Chúng tôi đã gửi mã xác thực tới{' '}
                  <span className="font-medium text-neutral-900">{email.trim()}</span>.
                  Nhập mã đó vào bên dưới để đăng nhập.
                </p>
              </div>

              {status === 'error' && errorMsg && (
                <ErrorMessage message={errorMsg} />
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Mã xác thực
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Nhập mã xác thực"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={10}
                  disabled={status === 'loading'}
                  className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-center text-base tracking-[0.3em] text-neutral-900 placeholder:text-neutral-300 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-50 disabled:text-neutral-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-white hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-[filter]"
              >
                {status === 'loading' ? 'Đang xác thực…' : 'Xác nhận'}
              </button>

              <p className="text-xs text-neutral-400 text-center leading-relaxed">
                Không thấy email? Kiểm tra thư mục spam hoặc{' '}
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="underline hover:text-neutral-600 transition-colors"
                >
                  đổi email
                </button>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
