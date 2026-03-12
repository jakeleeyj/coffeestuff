import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import FeedGrid from '@/components/feed/FeedGrid'
import type { PostWithRelations } from '@/lib/types'

export default async function FeedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch posts first — no joins, avoids FK dependency issues
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, image_url, caption, brew_method, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) console.error('Feed error:', error.message)

  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <h1 className="font-display text-2xl text-text mb-6">Feed</h1>
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

  // Fetch profiles for all post authors
  const userIds = [...new Set(posts.map(p => p.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', userIds)

  // Fetch bean tags
  const postIds = posts.map(p => p.id)
  const { data: postBeans } = await supabase
    .from('post_beans')
    .select('post_id, beans(id, name, roast_level)')
    .in('post_id', postIds)

  // Fetch comment counts + like counts + user's likes
  const [{ data: commentRows }, { data: likeRows }, { data: userLikes }] = await Promise.all([
    supabase.from('comments').select('post_id').in('post_id', postIds),
    supabase.from('likes').select('post_id').in('post_id', postIds),
    user
      ? supabase.from('likes').select('post_id').eq('user_id', user.id).in('post_id', postIds)
      : { data: [] },
  ])

  const commentCountMap: Record<string, number> = {}
  for (const c of commentRows ?? []) {
    commentCountMap[c.post_id] = (commentCountMap[c.post_id] ?? 0) + 1
  }
  const likeCountMap: Record<string, number> = {}
  for (const l of likeRows ?? []) {
    likeCountMap[l.post_id] = (likeCountMap[l.post_id] ?? 0) + 1
  }
  const userLikeSet = new Set((userLikes ?? []).map(l => l.post_id))

  // Merge into PostWithRelations shape
  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]))
  const beanMap: Record<string, { beans: { id: string; name: string; roast_level: string | null } | null }[]> = {}
  for (const pb of postBeans ?? []) {
    if (!beanMap[pb.post_id]) beanMap[pb.post_id] = []
    beanMap[pb.post_id].push({ beans: pb.beans as unknown as { id: string; name: string; roast_level: string | null } | null })
  }

  const enriched: PostWithRelations[] = posts.map(post => ({
    ...post,
    profiles: profileMap[post.user_id] ?? null,
    post_beans: beanMap[post.id] ?? [],
    comment_count: commentCountMap[post.id] ?? 0,
    like_count: likeCountMap[post.id] ?? 0,
    liked_by_user: userLikeSet.has(post.id),
  }))

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="font-display text-2xl text-text mb-6">Feed</h1>
      <FeedGrid posts={enriched} userId={user?.id} />
    </div>
  )
}
