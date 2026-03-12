'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { addComment } from '@/lib/actions/interactions'

export default function CommentForm({ postId }: { postId: string }) {
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
        placeholder="Add a comment..."
        maxLength={500}
        className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-bloom transition-colors"
      />
      <button
        type="submit"
        disabled={isPending || !body.trim()}
        className="px-4 py-2 text-sm font-medium bg-bloom text-base rounded-lg hover:bg-bloom-hover transition-colors disabled:opacity-40"
      >
        {isPending ? '...' : 'Post'}
      </button>
    </form>
  )
}
