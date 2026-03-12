'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const inputCls = "w-full bg-white/[0.04] border border-glass-border rounded-xl px-4 py-3 text-sm text-text placeholder-text-dim focus:outline-none focus:border-bloom focus:bg-white/[0.06] transition-all"

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/feed')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-950/50 border border-red-800/40 text-red-300 text-sm px-4 py-2.5 rounded-xl">
          {error}
        </div>
      )}
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
          className={inputCls}
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-bloom text-base font-semibold py-3 rounded-xl text-sm hover:bg-bloom-hover transition-all disabled:opacity-50 glow-pulse mt-1"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
