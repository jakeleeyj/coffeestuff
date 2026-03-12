'use client'

import { useEffect, useRef, useState, useTransition, useCallback } from 'react'
import PostCard from './PostCard'
import { loadFeedPage } from '@/lib/actions/feed'
import type { PostWithRelations } from '@/lib/types'

type Props = {
  initialPosts: PostWithRelations[]
  initialCursor: string | null
  userId?: string
}

export default function FeedGrid({ initialPosts, initialCursor, userId }: Props) {
  const [posts, setPosts] = useState(initialPosts)
  const [cursor, setCursor] = useState(initialCursor)
  const [isPending, startTransition] = useTransition()
  const loaderRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(() => {
    if (!cursor || isPending) return
    startTransition(async () => {
      const { posts: newPosts, nextCursor } = await loadFeedPage(cursor)
      setPosts(prev => [...prev, ...newPosts])
      setCursor(nextCursor)
    })
  }, [cursor, isPending])

  useEffect(() => {
    const el = loaderRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  if (posts.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      {posts.map(post => <PostCard key={post.id} post={post} userId={userId} />)}

      <div ref={loaderRef} className="py-4 text-center">
        {isPending && (
          <span className="text-xs text-text-muted">Loading more...</span>
        )}
        {!cursor && posts.length > 0 && (
          <span className="text-xs text-text-dim">You&apos;re all caught up</span>
        )}
      </div>
    </div>
  )
}
