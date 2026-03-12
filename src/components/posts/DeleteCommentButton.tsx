'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { deleteComment } from '@/lib/actions/interactions'

export default function DeleteCommentButton({ commentId, postId }: { commentId: string; postId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteComment(commentId, postId)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-[11px] text-text-dim hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
    >
      {isPending ? '...' : 'delete'}
    </button>
  )
}
