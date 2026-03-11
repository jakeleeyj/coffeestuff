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
      <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg text-center">
        Check your email to confirm your account, then sign in.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-coffee-800 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          minLength={3}
          pattern="[a-zA-Z0-9_]+"
          title="Letters, numbers and underscores only"
          className="w-full border border-coffee-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-coffee-800 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border border-coffee-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-coffee-800 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border border-coffee-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-coffee-700 text-cream py-2 rounded-lg text-sm font-medium hover:bg-coffee-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
