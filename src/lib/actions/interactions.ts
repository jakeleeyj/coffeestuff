'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addComment(postId: string, body: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const trimmed = body.trim()
  if (!trimmed) throw new Error('Comment cannot be empty')

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    body: trimmed,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/posts/${postId}`)
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath(`/posts/${postId}`)
}
