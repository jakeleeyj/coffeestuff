'use client'

import { useState, useEffect } from 'react'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 6) return { text: 'Late night brew', emoji: '🌙' }
  if (hour < 12) return { text: 'Good morning', emoji: '☀️' }
  if (hour < 17) return { text: 'Good afternoon', emoji: '☕' }
  if (hour < 21) return { text: 'Good evening', emoji: '🌅' }
  return { text: 'Night owl', emoji: '🦉' }
}

export default function FeedGreeting({ displayName }: { displayName: string }) {
  const [greeting, setGreeting] = useState<{ text: string; emoji: string } | null>(null)

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  if (!greeting) {
    return (
      <div className="mb-6">
        <div className="skeleton h-8 w-48 mb-2" />
        <div className="skeleton h-4 w-32" />
      </div>
    )
  }

  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl text-text tracking-tight">
        {greeting.text}{displayName ? `, ${displayName}` : ''}
        <span className="ml-2 inline-block" style={{ animation: 'float 3s ease-in-out infinite' }}>{greeting.emoji}</span>
      </h1>
      <p className="text-sm text-text-muted mt-1">Here&apos;s what&apos;s brewing</p>
    </div>
  )
}
