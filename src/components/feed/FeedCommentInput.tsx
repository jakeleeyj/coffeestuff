'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { addComment } from '@/lib/actions/interactions'

export default function FeedCommentInput({ postId }: { postId: string }) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return

    startTransition(async () => {
      await addComment(postId, body)
      setBody('')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Comment..."
        maxLength={500}
        className="flex-1 bg-transparent text-sm text-text placeholder:text-text-dim focus:outline-none"
      />
      {body.trim() && (
        <button
          type="submit"
          disabled={isPending}
          className="text-xs font-semibold text-bloom hover:text-bloom-hover transition-colors disabled:opacity-40"
        >
          {isPending ? '...' : 'Post'}
        </button>
      )}
    </form>
  )
}
