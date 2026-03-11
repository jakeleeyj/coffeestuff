import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-coffee-900">☕ Sirius</h1>
          <p className="text-coffee-600 mt-2 text-sm">Sign in to your account</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-coffee-600 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-coffee-800 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
