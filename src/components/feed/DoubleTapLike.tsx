'use client'

import { useRef, useState, useTransition, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { toggleLike } from '@/lib/actions/interactions'

type Props = {
  postId: string
  liked: boolean
  children: ReactNode
}

export default function DoubleTapLike({ postId, liked, children }: Props) {
  const lastTap = useRef(0)
  const [showHeart, setShowHeart] = useState(false)
  const [, startTransition] = useTransition()
  const router = useRouter()

  function handleTap() {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      // Double tap
      if (!liked) {
        startTransition(async () => {
          await toggleLike(postId)
          router.refresh()
        })
      }
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 900)
    }
    lastTap.current = now
  }

  return (
    <div className="relative cursor-pointer" onClick={handleTap}>
      {children}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="white"
            className="heart-pop drop-shadow-lg"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      )}
    </div>
  )
}
