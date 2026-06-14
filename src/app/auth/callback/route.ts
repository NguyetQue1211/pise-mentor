import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/access-denied`)
  }

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

  const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

  if (sessionError || !sessionData.user) {
    return NextResponse.redirect(`${origin}/access-denied`)
  }

  const authUser = sessionData.user
  const email = authUser.email?.trim().toLowerCase()

  if (!email) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/access-denied`)
  }

  // Post-auth whitelist check using the admin client (bypasses RLS).
  // This is a second enforcement layer in case the pre-auth check was bypassed
  // (e.g. the Supabase Auth API was called directly).
  const admin = createAdminClient()

  const { data: appUser, error: dbError } = await admin
    .from('app_users')
    .select('id, status, auth_user_id')
    .eq('email', email)
    .maybeSingle()

  if (dbError || !appUser || appUser.status !== 'active') {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/access-denied`)
  }

  // Link auth_user_id on first successful login only.
  // The .is('auth_user_id', null) condition ensures we never overwrite
  // an existing value even if two requests race.
  if (!appUser.auth_user_id) {
    await admin
      .from('app_users')
      .update({
        auth_user_id: authUser.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appUser.id)
      .is('auth_user_id', null)
  }

  return NextResponse.redirect(`${origin}/home`)
}
