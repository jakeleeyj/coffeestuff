'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const THRESHOLD = 80
const MAX_PULL = 120

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [pullY, setPullY] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const pulling = useRef(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY > 0 || refreshing) return
    startY.current = e.touches[0].clientY
    pulling.current = true
  }, [refreshing])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling.current || refreshing) return
    const dy = e.touches[0].clientY - startY.current
    if (dy < 0) { pulling.current = false; setPullY(0); return }
    // Rubber band effect — diminishing returns
    const pull = Math.min(MAX_PULL, dy * 0.4)
    setPullY(pull)
  }, [refreshing])

  const onTouchEnd = useCallback(() => {
    if (!pulling.current) return
    pulling.current = false
    if (pullY >= THRESHOLD) {
      setRefreshing(true)
      setPullY(THRESHOLD * 0.6)
      router.refresh()
      // Give the refresh time to complete
      setTimeout(() => {
        setRefreshing(false)
        setPullY(0)
      }, 1000)
    } else {
      setPullY(0)
    }
  }, [pullY, router])

  const progress = Math.min(1, pullY / THRESHOLD)

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex justify-center overflow-hidden transition-[height] ease-out"
        style={{
          height: pullY > 0 ? pullY : 0,
          transitionDuration: pulling.current ? '0ms' : '300ms',
        }}
      >
        <div className="flex items-center justify-center pt-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className={refreshing ? 'bean-spinner' : ''}
            style={{
              opacity: progress,
              transform: refreshing ? undefined : `rotate(${progress * 360}deg) scale(${0.5 + progress * 0.5})`,
              transition: pulling.current ? 'none' : 'all 0.3s ease',
            }}
          >
            <ellipse cx="12" cy="12" rx="7" ry="5" transform="rotate(-35 12 12)" stroke="#d4963f" strokeWidth="1.5" fill="rgba(212, 150, 63, 0.15)" />
            <path d="M12 7.5c0 2.5-1.5 4.5-1.5 4.5s1.5 2 1.5 4.5" stroke="#d4963f" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div
        style={{
          transform: pullY > 0 ? `translateY(${pullY * 0.1}px)` : 'none',
          transition: pulling.current ? 'none' : 'transform 0.3s ease',
        }}
      >
        {children}
      </div>
    </div>
  )
}
