'use server'

import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { createClient } from '@/lib/supabase/server'

export async function recordBookingIntent(mentorProfileId: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) return

  const supabase = await createClient()
  await supabase.from('booking_intents').insert({
    mentor_profile_id: mentorProfileId,
    mentee_user_id: user.id,
  })
}
