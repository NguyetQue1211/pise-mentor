import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const PUBLIC_PATHS = new Set(['/login', '/access-denied'])

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true
  // Allow Supabase auth callback and any sub-paths
  if (pathname.startsWith('/auth/')) return true
  return false
}

function makeRedirect(
  pathname: string,
  request: NextRequest,
  supabaseResponse: NextResponse
): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  const redirectResponse = NextResponse.redirect(url)
  // Preserve any session cookies updated during getUser()
  supabaseResponse.cookies.getAll().forEach(cookie =>
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
  )
  return redirectResponse
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) return NextResponse.next()

  // Supabase SSR middleware client — must follow this exact pattern to
  // correctly handle session token rotation via cookies.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() validates the session token server-side — never trust client state
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return makeRedirect('/login', request, supabaseResponse)
  }

  // Resolve role from app_users. The user_read_own RLS policy allows this
  // query because auth_user_id = auth.uid() is satisfied for authenticated users.
  const { data: appUser } = await supabase
    .from('app_users')
    .select('role, status')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!appUser || appUser.status !== 'active') {
    return makeRedirect('/access-denied', request, supabaseResponse)
  }

  const { role } = appUser

  // / → redirect authenticated users to /home
  if (pathname === '/') {
    return makeRedirect('/home', request, supabaseResponse)
  }

  // /admin/* → admin only
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return makeRedirect('/access-denied', request, supabaseResponse)
  }

  // /mentor/profile* → mentor only
  if (pathname.startsWith('/mentor/profile') && role !== 'mentor') {
    return makeRedirect('/access-denied', request, supabaseResponse)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
