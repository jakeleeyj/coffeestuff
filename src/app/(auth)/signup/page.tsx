import Link from 'next/link'
import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 relative overflow-hidden">
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

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl text-cream mb-3 tracking-tight">Bloom</h1>
          <p className="text-text-muted text-sm tracking-wide">Join the coffee community</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-text font-semibold mb-5 text-lg">Create account</h2>
          <SignupForm />
        </div>
        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-bloom hover:text-bloom-hover transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
