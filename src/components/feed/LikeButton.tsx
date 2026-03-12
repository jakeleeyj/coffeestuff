'use client'

import { useOptimistic, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toggleLike } from '@/lib/actions/interactions'

type Props = {
  postId: string
  likeCount: number
  liked: boolean
}

export default function LikeButton({ postId, likeCount, liked }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(
    { liked, likeCount },
    (state) => ({
      liked: !state.liked,
      likeCount: state.liked ? state.likeCount - 1 : state.likeCount + 1,
    })
  )

  const svgRef = useRef<SVGSVGElement>(null)

  function handleClick() {
    // Trigger bounce animation
    const el = svgRef.current
    if (el) {
      el.classList.remove('like-pop')
      requestAnimationFrame(() => el.classList.add('like-pop'))
    }
    startTransition(async () => {
      setOptimistic(optimistic)
      await toggleLike(postId)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-1.5 group"
    >
      <svg
        ref={svgRef}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={optimistic.liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-colors ${
          optimistic.liked
            ? 'text-red-400'
            : 'text-text-muted group-hover:text-red-400'
        }`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {optimistic.likeCount > 0 && (
        <span className={`text-xs font-medium ${optimistic.liked ? 'text-red-400' : 'text-text-muted'}`}>
          {optimistic.likeCount}
        </span>
      )}
    </button>
  )
}
