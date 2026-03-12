'use server'

import { createClient } from '@/lib/supabase/server'
import type { PostWithRelations } from '@/lib/types'

const PAGE_SIZE = 10

export async function loadFeedPage(cursor?: string, brewMethod?: string): Promise<{ posts: PostWithRelations[]; nextCursor: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('posts')
    .select('id, image_url, caption, brew_method, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  if (brewMethod) {
    query = query.eq('brew_method', brewMethod)
  }

  const { data: posts } = await query
  if (!posts || posts.length === 0) return { posts: [], nextCursor: null }

  const postIds = posts.map(p => p.id)
  const userIds = [...new Set(posts.map(p => p.user_id))]

  const [{ data: profiles }, { data: postBeans }, { data: commentRows }, { data: likeRows }, { data: userLikes }] = await Promise.all([
    supabase.from('profiles').select('id, username, avatar_url').in('id', userIds),
    supabase.from('post_beans').select('post_id, beans(id, name, roast_level)').in('post_id', postIds),
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

  const nextCursor = posts.length === PAGE_SIZE ? posts[posts.length - 1].created_at : null

  return { posts: enriched, nextCursor }
}
