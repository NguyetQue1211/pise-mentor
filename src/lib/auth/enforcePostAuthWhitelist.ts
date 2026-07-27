import { createAdminClient } from '@/lib/supabase/admin'

// Post-auth whitelist check using the admin client (bypasses RLS).
// Second enforcement layer in case the pre-auth check in requestLoginLink
// was bypassed (e.g. the Supabase Auth API was called directly).
// Also links auth_user_id on first successful login (never overwrites).
export async function enforcePostAuthWhitelist(
  authUserId: string,
  email: string
): Promise<boolean> {
  const admin = createAdminClient()

  const { data: appUser, error } = await admin
    .from('app_users')
    .select('id, status, auth_user_id')
    .eq('email', email)
    .maybeSingle()

  if (error || !appUser || appUser.status !== 'active') {
    return false
  }

  if (!appUser.auth_user_id) {
    await admin
      .from('app_users')
      .update({
        auth_user_id: authUserId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appUser.id)
      .is('auth_user_id', null)
  }

  return true
}
