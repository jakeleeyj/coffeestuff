import Link from 'next/link'
import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-dvh bg-base flex flex-col items-center justify-center px-5"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(212,150,63,0.1) 0%, #0d0906 60%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-cream mb-2">Bloom</h1>
          <p className="text-text-muted text-sm">Your coffee community</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-text font-semibold mb-5">Create account</h2>
          <SignupForm />
        </div>
        <p className="text-center text-sm text-text-muted mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-bloom hover:text-bloom-hover transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
