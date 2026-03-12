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
    return <div className="skeleton h-6 w-48 mb-3" />
  }

  return (
    <div className="mb-3 flex items-center justify-between">
      <h1 className="font-display text-lg text-text tracking-tight">
        {greeting.text}{displayName ? `, ${displayName}` : ''}
        <span className="ml-1.5 inline-block text-sm" style={{ animation: 'float 3s ease-in-out infinite' }}>{greeting.emoji}</span>
      </h1>
    </div>
  )
}
