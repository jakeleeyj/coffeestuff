'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const username = user?.user_metadata?.username ?? user?.email?.split('@')[0] ?? ''
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <nav className="border-b border-coffee-200 bg-cream sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/feed" className="text-coffee-900 font-semibold text-lg tracking-tight">
            ☕ Sirius
          </Link>
          <Link href="/feed" className="text-coffee-700 text-sm hover:text-coffee-900 transition-colors">
            Feed
          </Link>
          <Link href="/beans" className="text-coffee-700 text-sm hover:text-coffee-900 transition-colors">
            Beans
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/posts/new"
                className="bg-coffee-700 text-cream text-sm px-3 py-1.5 rounded-full hover:bg-coffee-800 transition-colors"
              >
                + New Post
              </Link>
              <div className="w-8 h-8 rounded-full bg-coffee-600 text-cream flex items-center justify-center text-xs font-medium">
                {initials}
              </div>
              <button
                onClick={handleSignOut}
                className="text-coffee-600 text-sm hover:text-coffee-900 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-coffee-700 text-sm hover:text-coffee-900 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
