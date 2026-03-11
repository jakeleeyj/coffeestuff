import Link from 'next/link'
import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-coffee-900">☕ Sirius</h1>
          <p className="text-coffee-600 mt-2 text-sm">Create your account</p>
        </div>
        <SignupForm />
        <p className="text-center text-sm text-coffee-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-coffee-800 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
