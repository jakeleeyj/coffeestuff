import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import FeedGrid from '@/components/feed/FeedGrid'
import { loadFeedPage } from '@/lib/actions/feed'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

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

  const greeting = getGreeting()

  if (posts.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <h1 className="font-display text-2xl text-text mb-1">{greeting}{displayName ? `, ${displayName}` : ''}</h1>
        <p className="text-sm text-text-muted mb-6">Here&apos;s what&apos;s brewing</p>
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
      <h1 className="font-display text-2xl text-text mb-1">{greeting}{displayName ? `, ${displayName}` : ''}</h1>
      <p className="text-sm text-text-muted mb-6">Here&apos;s what&apos;s brewing</p>
      <FeedGrid initialPosts={posts} initialCursor={nextCursor} userId={user?.id} />
    </div>
  )
}
