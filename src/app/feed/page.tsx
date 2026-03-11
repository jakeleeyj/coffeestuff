import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import FeedGrid from '@/components/feed/FeedGrid'
import type { PostWithRelations } from '@/lib/types'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      id, image_url, caption, brew_method, created_at,
      profiles!posts_user_id_fkey(id, username, avatar_url),
      post_beans(beans(id, name, roast_level))
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="font-display text-2xl text-text mb-6">Feed</h1>

      {posts && posts.length > 0 ? (
        <FeedGrid posts={posts as unknown as PostWithRelations[]} />
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">☕</p>
          <p className="text-text-muted text-sm">No posts yet.</p>
          <Link href="/posts/new" className="text-bloom text-sm mt-2 inline-block hover:text-bloom-hover transition-colors">
            Share your first cup →
          </Link>
        </div>
      )}
    </div>
  )
}
