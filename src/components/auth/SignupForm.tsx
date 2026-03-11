'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SignupForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-bloom-glow border border-bloom-dim text-bloom text-sm px-4 py-3 rounded-xl text-center">
        Check your email to confirm your account, then sign in.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-950/50 border border-red-800/50 text-red-300 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          minLength={3}
          pattern="[a-zA-Z0-9_]+"
          title="Letters, numbers and underscores only"
          className="w-full bg-surface-raised border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-text-dim focus:outline-none focus:border-bloom transition-colors"
          placeholder="yourname"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-surface-raised border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-text-dim focus:outline-none focus:border-bloom transition-colors"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-surface-raised border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-bloom transition-colors"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-bloom text-base font-semibold py-2.5 rounded-xl text-sm hover:bg-bloom-hover transition-colors disabled:opacity-50 mt-1"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
