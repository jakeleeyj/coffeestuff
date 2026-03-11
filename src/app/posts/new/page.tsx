import { createClient } from '@/lib/supabase/server'
import PostForm from '@/components/posts/PostForm'

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: beans } = await supabase
    .from('beans')
    .select('id, name, roast_level')
    .order('name')

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      <h1 className="font-display text-2xl text-text mb-6">New post</h1>
      <PostForm beans={beans ?? []} />
    </div>
  )
}
