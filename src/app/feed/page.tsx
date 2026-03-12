import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import FeedGrid from '@/components/feed/FeedGrid'
import FeedGreeting from '@/components/feed/FeedGreeting'
import { loadFeedPage } from '@/lib/actions/feed'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get display name
  let displayName = ''
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, username')
      .eq('id', user.id)
      .single()
    displayName = profile?.display_name || profile?.username || ''
  }

  const { posts, nextCursor } = await loadFeedPage()

  if (posts.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <FeedGreeting displayName={displayName} />
        <div className="text-center py-16">
          <p className="text-4xl mb-3">☕</p>
          <p className="text-text-muted text-sm">No posts yet.</p>
          <Link href="/posts/new" className="text-bloom text-sm mt-2 inline-block hover:text-bloom-hover transition-colors">
            Share your first cup →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <FeedGreeting displayName={displayName} />
      <FeedGrid initialPosts={posts} initialCursor={nextCursor} userId={user?.id} />
    </div>
  )
}
