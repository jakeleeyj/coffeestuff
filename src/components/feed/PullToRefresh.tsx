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
          <div
            className={`w-5 h-5 rounded-full border-2 border-bloom ${refreshing ? 'border-t-transparent animate-spin' : ''}`}
            style={{
              opacity: progress,
              transform: `rotate(${progress * 360}deg) scale(${0.5 + progress * 0.5})`,
              transition: pulling.current ? 'none' : 'all 0.3s ease',
            }}
          />
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
