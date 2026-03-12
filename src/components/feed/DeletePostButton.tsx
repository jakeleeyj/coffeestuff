'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deletePost } from '@/lib/actions/posts'

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function handleClick() {
    if (!confirming) {
      setConfirming(true)
      return
    }

    startTransition(async () => {
      await deletePost(postId)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      disabled={isPending}
      className={`text-xs transition-colors ${
        confirming
          ? 'text-red-400 font-medium'
          : 'text-text-dim hover:text-red-400'
      } ${isPending ? 'opacity-50' : ''}`}
    >
      {isPending ? 'Deleting...' : confirming ? 'Confirm?' : 'Delete'}
    </button>
  )
}
