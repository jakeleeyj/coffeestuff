import Link from 'next/link'
import BeanForm from '@/components/beans/BeanForm'

export default function NewBeanPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/beans" className="text-text-muted hover:text-text transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-display text-2xl text-text">Add a bean</h1>
      </div>
      <div className="bg-surface border border-border rounded-2xl p-5">
        <BeanForm />
      </div>
    </div>
  )
}
