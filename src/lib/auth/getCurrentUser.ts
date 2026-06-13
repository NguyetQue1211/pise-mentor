import { createClient } from '@/lib/supabase/server'

export type AppUser = {
  id: string
  email: string
  name: string | null
  role: 'mentee' | 'mentor' | 'admin'
  status: 'active' | 'inactive'
  auth_user_id: string
}

// Resolves the current authenticated app user from app_users.
// Uses the SSR client — RLS policy user_read_own allows an authenticated user
// to read their own row (auth_user_id = auth.uid()).
// Returns null if unauthenticated or inactive.
export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: appUser } = await supabase
    .from('app_users')
    .select('id, email, name, role, status, auth_user_id')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!appUser || appUser.status !== 'active') return null

  return appUser as AppUser
}
