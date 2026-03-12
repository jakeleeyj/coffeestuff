'use client'

import { useEffect, useRef, useState, useTransition, useCallback } from 'react'
import PostCard from './PostCard'
import { loadFeedPage } from '@/lib/actions/feed'
import type { PostWithRelations } from '@/lib/types'

const BREW_METHODS = [
  { value: 'espresso', label: 'Espresso' },
  { value: 'pour-over', label: 'Pour Over' },
  { value: 'aeropress', label: 'AeroPress' },
  { value: 'french-press', label: 'French Press' },
  { value: 'cold-brew', label: 'Cold Brew' },
  { value: 'moka-pot', label: 'Moka Pot' },
  { value: 'chemex', label: 'Chemex' },
  { value: 'v60', label: 'V60' },
]

type Props = {
  initialPosts: PostWithRelations[]
  initialCursor: string | null
  userId?: string
}

export default function FeedGrid({ initialPosts, initialCursor, userId }: Props) {
  const [posts, setPosts] = useState(initialPosts)
  const [cursor, setCursor] = useState(initialCursor)
  const [filter, setFilter] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const loaderRef = useRef<HTMLDivElement>(null)

  // When filter changes, reload from scratch
  useEffect(() => {
    if (filter === null) {
      setPosts(initialPosts)
      setCursor(initialCursor)
      return
    }
    startTransition(async () => {
      const { posts: filtered, nextCursor } = await loadFeedPage(undefined, filter)
      setPosts(filtered)
      setCursor(nextCursor)
    })
  }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (!cursor || isPending) return
    startTransition(async () => {
      const { posts: newPosts, nextCursor } = await loadFeedPage(cursor, filter ?? undefined)
      setPosts(prev => [...prev, ...newPosts])
      setCursor(nextCursor)
    })
  }, [cursor, isPending, filter])

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

  return (
    <div className="flex flex-col gap-4">
      {/* Brew method filter pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-4 px-4">
        <button
          onClick={() => setFilter(null)}
          className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
            filter === null
              ? 'bg-bloom text-base shadow-[0_0_12px_rgba(212,150,63,0.3)]'
              : 'glass-subtle text-text-muted hover:text-text hover:border-bloom-dim/20'
          }`}
        >
          All
        </button>
        {BREW_METHODS.map(method => (
          <button
            key={method.value}
            onClick={() => setFilter(method.value)}
            className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              filter === method.value
                ? 'bg-bloom text-base shadow-[0_0_12px_rgba(212,150,63,0.3)]'
                : 'glass-subtle text-text-muted hover:text-text hover:border-bloom-dim/20'
            }`}
          >
            {method.label}
          </button>
        ))}
      </div>

      {/* Posts — first one gets hero treatment */}
      {posts.map((post, i) => (
        <div
          key={post.id}
          className="card-in"
          style={{ animationDelay: `${Math.min(i * 0.08, 0.4)}s` }}
        >
          <PostCard post={post} userId={userId} isHero={i === 0 && filter === null} />
        </div>
      ))}

      {posts.length === 0 && !isPending && (
        <div className="text-center py-12">
          <p className="text-3xl mb-3">☕</p>
          <p className="text-sm text-text-muted">No {filter} posts yet.</p>
        </div>
      )}

      <div ref={loaderRef} className="py-6 text-center">
        {isPending && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-bloom border-t-transparent animate-spin" />
            <span className="text-xs text-text-muted">Loading...</span>
          </div>
        )}
        {!cursor && posts.length > 0 && !isPending && (
          <p className="text-xs text-text-dim">
            You&apos;re all caught up
          </p>
        )}
      </div>
    </div>
  )
}
