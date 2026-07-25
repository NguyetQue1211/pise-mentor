'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'

type Role = 'mentee' | 'mentor' | 'admin'

const roleLabel: Record<Role, string> = {
  mentee: 'Học viên',
  mentor: 'Mentor',
  admin: 'Quản trị viên',
}

const roleLinks: Record<Role, { label: string; href: string }[]> = {
  mentee: [],
  mentor: [{ label: 'Hồ sơ của tôi', href: '/mentor/profile' }],
  admin: [{ label: 'Trang quản trị', href: '/admin/mentors' }],
}

interface UserMenuProps {
  role: Role
  userName: string
  feedbackUrl?: string
}

export default function UserMenu({ role, userName, feedbackUrl }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const initial = userName.trim().charAt(0).toUpperCase()
  const links = roleLinks[role]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Mở menu tài khoản"
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white text-sm font-semibold hover:brightness-105 transition-[filter] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 select-none"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-neutral-200 shadow-lg z-50 overflow-hidden">
          {/* Identity */}
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-900 truncate">{userName}</p>
            <span className="inline-block mt-1 text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
              {roleLabel[role]}
            </span>
          </div>

          {/* Role-specific links */}
          {links.length > 0 && (
            <div className="border-b border-neutral-100">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Feedback */}
          {feedbackUrl && (
            <div className="border-b border-neutral-100">
              <a
                href={feedbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Gửi phản hồi
              </a>
            </div>
          )}

          {/* Sign out */}
          <form action={signOut}>
            <button
              type="submit"
              className="w-full text-left px-4 py-2.5 text-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
