'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addBean(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('beans').insert({
    name: formData.get('name') as string,
    roaster: formData.get('roaster') as string,
    origin: (formData.get('origin') as string) || null,
    roast_level: (formData.get('roast_level') as string) || null,
    added_by: user.id,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/beans')
  redirect('/beans')
}
