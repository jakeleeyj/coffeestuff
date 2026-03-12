import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 20%, rgba(212, 150, 63, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(80, 100, 160, 0.06) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 60%, rgba(212, 150, 63, 0.03) 0%, transparent 40%)
          `
        }}
      />

      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: '15%', top: '20%', size: 4, delay: 0 },
          { left: '75%', top: '15%', size: 3, delay: 0.8 },
          { left: '85%', top: '65%', size: 5, delay: 1.6 },
          { left: '10%', top: '70%', size: 3, delay: 2.4 },
          { left: '50%', top: '85%', size: 4, delay: 0.4 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-bloom/20"
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              animation: `float 4s ease-in-out ${dot.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl text-cream mb-3 tracking-tight">Bloom</h1>
          <p className="text-text-muted text-sm tracking-wide">Your coffee community</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-text font-semibold mb-5 text-lg">Welcome back</h2>
          <LoginForm />
        </div>
        <p className="text-center text-sm text-text-muted mt-6">
          New here?{' '}
          <Link href="/signup" className="text-bloom hover:text-bloom-hover transition-colors font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
