'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const inputCls = "w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-text placeholder-text-dim focus:outline-none focus:border-bloom/60 focus:bg-white/[0.05] transition-all"

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
      <div className="bg-bloom/10 border border-bloom/20 text-bloom text-sm px-4 py-3 rounded-xl text-center">
        Check your email to confirm your account, then sign in.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-950/50 border border-red-800/40 text-red-300 text-sm px-4 py-2.5 rounded-xl">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          minLength={3}
          pattern="[a-zA-Z0-9_]+"
          title="Letters, numbers and underscores only"
          className={inputCls}
          placeholder="yourname"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={inputCls}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className={inputCls}
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-bloom text-base font-semibold py-3 rounded-xl text-sm hover:bg-bloom-hover transition-all disabled:opacity-50 glow-pulse mt-1"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
