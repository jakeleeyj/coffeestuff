'use client'

import { useState, useEffect } from 'react'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function FeedGreeting({ displayName }: { displayName: string }) {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  if (!greeting) return <h1 className="font-display text-2xl text-text mb-1">&nbsp;</h1>

  return (
    <>
      <h1 className="font-display text-2xl text-text mb-1">
        {greeting}{displayName ? `, ${displayName}` : ''}
      </h1>
      <p className="text-sm text-text-muted mb-6">Here&apos;s what&apos;s brewing</p>
    </>
  )
}
