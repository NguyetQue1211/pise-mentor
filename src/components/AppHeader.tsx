import Link from 'next/link'
import UserMenu from '@/components/UserMenu'

type Role = 'mentee' | 'mentor' | 'admin'

interface AppHeaderProps {
  role?: Role
  userName?: string
}

export default function AppHeader({ role, userName }: AppHeaderProps) {
  const feedbackUrl = process.env.FEEDBACK_FORM_URL

  return (
    <header className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href={role ? '/mentors' : '/'}
            className="flex items-center gap-2 text-base font-bold text-neutral-900 tracking-tight hover:text-secondary-600 transition-colors"
          >
            <img src="/logo.jpeg" alt="PISE" className="h-7 w-7 rounded-md object-cover" />
            Mentors
          </Link>

          {role && userName && (
            <UserMenu
              role={role}
              userName={userName}
              feedbackUrl={feedbackUrl}
            />
          )}
        </div>
      </div>
      <div className="h-[3px] bg-gradient-secondary" />
    </header>
  )
}
