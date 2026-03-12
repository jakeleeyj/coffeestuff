'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { rateBean } from '@/lib/actions/beans-rating'
import { useToast } from '@/components/ui/Toast'

type Props = {
  beanId: string
  avgRating: number
  ratingCount: number
  userRating: number | null
}

export default function BeanRating({ beanId, avgRating, ratingCount, userRating }: Props) {
  const router = useRouter()
  const [hovered, setHovered] = useState(0)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const display = hovered || userRating || 0

  function handleRate(rating: number) {
    startTransition(async () => {
      await rateBean(beanId, rating)
      toast('Rating saved')
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            disabled={isPending}
            onMouseEnter={() => setHovered(star)}
            onClick={() => handleRate(star)}
            className="text-sm transition-colors disabled:opacity-50"
          >
            <span className={star <= display ? 'text-bloom' : 'text-text-dim'}>
              ★
            </span>
          </button>
        ))}
      </div>
      {ratingCount > 0 && (
        <span className="text-[11px] text-text-muted">
          {avgRating.toFixed(1)} ({ratingCount})
        </span>
      )}
    </div>
  )
}
