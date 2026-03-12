import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/feed')

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(212, 150, 63, 0.12) 0%, rgba(212, 150, 63, 0.04) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(138, 95, 40, 0.08) 0%, transparent 60%)',
          }}
        />
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Top nav */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 h-16">
        <span className="font-display text-2xl text-cream tracking-tight">Bloom</span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-bloom text-base px-4 py-1.5 rounded-full hover:bg-bloom-hover transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center -mt-16">
        {/* Coffee cup icon */}
        <div
          className="mb-8 w-20 h-20 rounded-2xl border border-border flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 17, 9, 0.9) 0%, rgba(35, 24, 16, 0.6) 100%)',
            boxShadow: '0 0 40px rgba(212, 150, 63, 0.08), inset 0 1px 0 rgba(212, 150, 63, 0.06)',
          }}
        >
          <span className="text-4xl">☕</span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.1] max-w-2xl">
          Your coffee,{' '}
          <span className="text-bloom italic">beautifully</span>{' '}
          shared
        </h1>

        <p className="mt-5 text-text-muted text-base md:text-lg max-w-md leading-relaxed">
          Capture your best brews. Tag your favorite beans.
          Connect with fellow coffee lovers.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-bloom text-base text-sm font-semibold px-6 py-3 rounded-full hover:bg-bloom-hover transition-colors"
            style={{ boxShadow: '0 0 30px rgba(212, 150, 63, 0.25)' }}
          >
            Start sharing
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/feed"
            className="text-sm text-text-muted hover:text-text transition-colors px-4 py-3"
          >
            Browse the feed
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: '📸', label: 'Photo posts' },
            { icon: '🫘', label: 'Bean library' },
            { icon: '☕', label: 'Brew methods' },
            { icon: '📝', label: 'Recipes' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-text-muted"
              style={{ background: 'rgba(26, 17, 9, 0.5)' }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade-out footer */}
      <footer className="relative z-10 text-center pb-8 pt-12">
        <p className="text-xs text-text-dim">
          Built for people who care about their cup
        </p>
      </footer>
    </div>
  )
}
