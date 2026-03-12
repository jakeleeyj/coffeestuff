'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const imageFile = formData.get('image') as File
  if (!imageFile || imageFile.size === 0) throw new Error('Image is required')
  if (imageFile.size > 5 * 1024 * 1024) throw new Error('Image must be under 5MB')

  const postId = crypto.randomUUID()
  const ext = imageFile.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${user.id}/${postId}.${ext}`

  const bytes = await imageFile.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(path, bytes, { contentType: imageFile.type })

  if (uploadError) throw new Error(uploadError.message)

  const { data: { publicUrl } } = supabase.storage
    .from('post-images')
    .getPublicUrl(path)

  const { error: postError } = await supabase.from('posts').insert({
    id: postId,
    user_id: user.id,
    image_url: publicUrl,
    caption: (formData.get('caption') as string) || null,
    brew_method: (formData.get('brew_method') as string) || null,
    recipe: (formData.get('recipe') as string) || null,
  })

  if (postError) {
    await supabase.storage.from('post-images').remove([path])
    throw new Error(postError.message)
  }

  const beanIds = formData.getAll('bean_ids') as string[]
  if (beanIds.length > 0) {
    await supabase.from('post_beans').insert(
      beanIds.map(bean_id => ({ post_id: postId, bean_id }))
    )
  }

  revalidatePath('/feed')
  redirect(`/posts/${postId}`)
}

export async function deletePost(postId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: post } = await supabase
    .from('posts')
    .select('image_url, user_id')
    .eq('id', postId)
    .single()

  if (!post || post.user_id !== user.id) throw new Error('Not authorized')

  const { error } = await supabase.from('posts').delete().eq('id', postId)
  if (error) throw new Error(error.message)

  // Clean up storage
  if (post.image_url) {
    try {
      const url = new URL(post.image_url)
      const parts = url.pathname.split('/post-images/')
      if (parts[1]) {
        await supabase.storage.from('post-images').remove([parts[1]])
      }
    } catch { /* ignore storage cleanup errors */ }
  }

  revalidatePath('/feed')
}
