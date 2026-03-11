'use client'

import { useTransition } from 'react'
import { addBean } from '@/lib/actions/beans'

export default function BeanForm() {
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => addBean(formData))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-coffee-800 mb-1">Bean name</label>
        <input
          name="name"
          type="text"
          required
          className="w-full border border-coffee-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-coffee-800 mb-1">Roaster</label>
        <input
          name="roaster"
          type="text"
          required
          className="w-full border border-coffee-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-coffee-800 mb-1">Origin <span className="text-coffee-400">(optional)</span></label>
        <input
          name="origin"
          type="text"
          className="w-full border border-coffee-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-coffee-800 mb-1">Roast level <span className="text-coffee-400">(optional)</span></label>
        <select
          name="roast_level"
          className="w-full border border-coffee-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee-500"
        >
          <option value="">Select…</option>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-coffee-700 text-cream py-2 rounded-lg text-sm font-medium hover:bg-coffee-800 transition-colors disabled:opacity-50"
      >
        {pending ? 'Adding…' : 'Add bean'}
      </button>
    </form>
  )
}
