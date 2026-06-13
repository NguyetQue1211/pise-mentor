'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type LoginResult =
  | { success: true }
  | { success: false; code: 'UNAPPROVED' | 'INACTIVE' | 'AUTH_ERROR'; message: string }

export async function requestLoginLink(rawEmail: string): Promise<LoginResult> {
  const email = rawEmail.trim().toLowerCase()

  const admin = createAdminClient()

  // Check app_users whitelist using the service role client (bypasses RLS).
  // The user has no session yet so the anon key cannot read this table.
  const { data: appUser, error: dbError } = await admin
    .from('app_users')
    .select('id, status')
    .eq('email', email)
    .maybeSingle()

  if (dbError) {
    console.error('[requestLoginLink] db error:', dbError.message)
    return {
      success: false,
      code: 'AUTH_ERROR',
      message: 'Something went wrong. Please try again.',
    }
  }

  if (!appUser) {
    return {
      success: false,
      code: 'UNAPPROVED',
      message:
        'This email is not approved for access. Please contact the PISE team if you believe this is a mistake.',
    }
  }

  if (appUser.status === 'inactive') {
    return {
      success: false,
      code: 'INACTIVE',
      message: 'Your access is currently inactive. Please contact the PISE team for support.',
    }
  }

  // Approved and active — send magic link via SSR client (not admin client).
  // The SSR client uses PKCE with cookie-based code verifier storage, so Supabase
  // generates a ?code= link. The plain admin client (supabase-js) has no code
  // verifier storage and falls back to the implicit flow (#access_token hash),
  // which the Route Handler callback cannot read.
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (otpError) {
    console.error('[requestLoginLink] otp error:', otpError.message)
    return {
      success: false,
      code: 'AUTH_ERROR',
      message: otpError.message,
    }
  }

  return { success: true }
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
  await supabase.auth.signOut()
  redirect('/login')
}
