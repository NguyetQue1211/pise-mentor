'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { enforcePostAuthWhitelist } from '@/lib/auth/enforcePostAuthWhitelist'
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

  // Approved and active — send an OTP code via SSR client.
  // Deliberately not passing emailRedirectTo: a clickable magic link opened
  // from a mobile Mail/Gmail app's in-app browser fails, because that
  // browser doesn't share cookies with the one that made this request (so
  // the PKCE code_verifier cookie is missing at /auth/callback). A typed
  // code has no such dependency — the user enters it back into this same
  // browser session, so verifyOtp below can always find the right session.
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

  const { error: otpError } = await supabase.auth.signInWithOtp({ email })

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

export async function verifyLoginCode(rawEmail: string, rawToken: string): Promise<LoginResult> {
  const email = rawEmail.trim().toLowerCase()
  const token = rawToken.trim()

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

  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })

  if (error || !data.user) {
    console.error('[verifyLoginCode] verifyOtp error:', error?.message, error?.code, error?.status)
    return {
      success: false,
      code: 'AUTH_ERROR',
      message: 'Mã không đúng hoặc đã hết hạn. Vui lòng thử lại.',
    }
  }

  const allowed = await enforcePostAuthWhitelist(data.user.id, email)

  if (!allowed) {
    await supabase.auth.signOut()
    return {
      success: false,
      code: 'UNAPPROVED',
      message: 'This email is not approved for access. Please contact the PISE team if you believe this is a mistake.',
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
