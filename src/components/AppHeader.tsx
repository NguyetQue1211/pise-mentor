import Link from 'next/link'
import UserMenu from '@/components/UserMenu'

type Role = 'mentee' | 'mentor' | 'admin'

interface AppHeaderProps {
  role?: Role
  userName?: string
}

const navLinks = [
  { label: 'Home', href: '/home' },
  { label: 'Mentors', href: '/mentors' },
]

export default function AppHeader({ role, userName }: AppHeaderProps) {
  const feedbackUrl = process.env.FEEDBACK_FORM_URL

  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href={role ? '/home' : '/'}
            className="text-base font-bold text-neutral-900 tracking-tight hover:text-primary-600 transition-colors"
          >
            PISE Mentors
          </Link>

          <div className="flex items-center gap-1">
            {role &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-neutral-600 rounded-lg hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

            {role && userName && (
              <div className="ml-2">
                <UserMenu
                  role={role}
                  userName={userName}
                  feedbackUrl={feedbackUrl}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
