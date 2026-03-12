'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function rateBean(beanId: string, rating: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (rating < 1 || rating > 5) throw new Error('Rating must be 1-5')

  // Upsert: insert or update on conflict
  const { error } = await supabase
    .from('bean_ratings')
    .upsert({ bean_id: beanId, user_id: user.id, rating }, { onConflict: 'bean_id,user_id' })

  if (error) throw new Error(error.message)

  revalidatePath('/beans')
}
