'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deletePost } from '@/lib/actions/posts'
import { useToast } from '@/components/ui/Toast'

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)
  const { toast } = useToast()

  function handleClick() {
    if (!confirming) {
      setConfirming(true)
      return
    }

    startTransition(async () => {
      await deletePost(postId)
      toast('Post deleted')
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
