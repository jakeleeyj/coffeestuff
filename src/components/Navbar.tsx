'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const HIDDEN_ROUTES = ['/login', '/signup', '/']

function IconFeed({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function IconBeans({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="7" ry="5" transform="rotate(-35 12 12)" />
      <path d="M12 7.5c0 2.5-1.5 4.5-1.5 4.5s1.5 2 1.5 4.5" />
    </svg>
  )
}

function IconBell({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
}

function IconProfile({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('notifications').select('id', { count: 'exact', head: true })
          .eq('user_id', data.user.id).eq('read', false)
          .then(({ count }) => setUnreadCount(count ?? 0))
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Refresh unread count on route change
  useEffect(() => {
    if (!user) return
    supabase.from('notifications').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).eq('read', false)
      .then(({ count }) => setUnreadCount(count ?? 0))
  }, [pathname, user])

  if (HIDDEN_ROUTES.includes(pathname)) return null

  const username = user?.user_metadata?.username ?? user?.email?.split('@')[0] ?? ''
  const initials = username.slice(0, 2).toUpperCase()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* ── Desktop top nav ── */}
      <nav
        className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass-subtle"
        style={{}}
      >
        <div className="max-w-5xl mx-auto w-full px-6 h-14 flex items-center justify-between">
          {/* Logo + links */}
          <div className="flex items-center gap-8">
            <Link href="/feed" className="font-display text-xl text-cream tracking-tight">
              Bloom
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/feed"
                className={`text-sm transition-colors ${pathname === '/feed' ? 'text-bloom font-medium' : 'text-text-muted hover:text-text'}`}
              >
                Feed
              </Link>
              <Link
                href="/beans"
                className={`text-sm transition-colors ${pathname.startsWith('/beans') ? 'text-bloom font-medium' : 'text-text-muted hover:text-text'}`}
              >
                Beans
              </Link>
            </div>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/posts/new"
                  className="bg-bloom text-base text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-bloom-hover transition-colors"
                >
                  + New Post
                </Link>
                <Link
                  href="/notifications"
                  className="relative text-text-muted hover:text-text transition-colors"
                >
                  <IconBell active={pathname === '/notifications'} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center px-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href={`/profile/${username}`}
                  className="w-8 h-8 rounded-full bg-surface-raised border border-border flex items-center justify-center text-xs font-semibold text-bloom hover:border-bloom-dim transition-colors"
                >
                  {initials}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-subtle"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center h-16">

          {/* Left side */}
          <div className="flex-1 flex justify-evenly">
            <Link href="/feed" className="flex flex-col items-center gap-1 py-1">
              <span className={pathname === '/feed' ? 'text-bloom' : 'text-text-muted'}>
                <IconFeed active={pathname === '/feed'} />
              </span>
              <span className={`text-[10px] font-medium ${pathname === '/feed' ? 'text-bloom' : 'text-text-muted'}`}>Feed</span>
            </Link>

            <Link href="/beans" className="flex flex-col items-center gap-1 py-1">
              <span className={pathname.startsWith('/beans') ? 'text-bloom' : 'text-text-muted'}>
                <IconBeans active={pathname.startsWith('/beans')} />
              </span>
              <span className={`text-[10px] font-medium ${pathname.startsWith('/beans') ? 'text-bloom' : 'text-text-muted'}`}>Beans</span>
            </Link>
          </div>

          {/* Center — New Post */}
          <Link href="/posts/new" className="flex flex-col items-center justify-center px-2">
            <span
              className="w-12 h-12 rounded-full bg-bloom flex items-center justify-center glow-pulse"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d0906" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex-1 flex justify-evenly">
            <Link href="/notifications" className="flex flex-col items-center gap-1 py-1 relative">
              <span className={pathname === '/notifications' ? 'text-bloom' : 'text-text-muted'}>
                <IconBell active={pathname === '/notifications'} />
              </span>
              <span className={`text-[10px] font-medium ${pathname === '/notifications' ? 'text-bloom' : 'text-text-muted'}`}>Alerts</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-1 min-w-[14px] h-3.5 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center px-0.5">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <Link
              href={user ? `/profile/${username}` : '/login'}
              className="flex flex-col items-center gap-1 py-1"
            >
              <span className={pathname.startsWith('/profile') ? 'text-bloom' : 'text-text-muted'}>
                <IconProfile active={pathname.startsWith('/profile')} />
              </span>
              <span className={`text-[10px] font-medium ${pathname.startsWith('/profile') ? 'text-bloom' : 'text-text-muted'}`}>
                {user ? username.slice(0, 8) : 'Profile'}
              </span>
            </Link>
          </div>

        </div>
      </nav>
    </>
  )
}
