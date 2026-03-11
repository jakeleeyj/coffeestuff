'use client'

import { useTransition } from 'react'
import { addBean, updateBean } from '@/lib/actions/beans'

type Bean = { id: string; name: string; roaster: string | null; origin: string | null; roast_level: string | null }

const inputCls = "w-full bg-surface-raised border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-text-dim focus:outline-none focus:border-bloom transition-colors"
const labelCls = "block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide"

export default function BeanForm({ bean }: { bean?: Bean }) {
  const [pending, startTransition] = useTransition()
  const isEdit = !!bean

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => isEdit ? updateBean(bean.id, formData) : addBean(formData))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Bean name</label>
        <input name="name" type="text" required defaultValue={bean?.name ?? ''} className={inputCls} placeholder="e.g. Ethiopia Yirgacheffe" />
      </div>
      <div>
        <label className={labelCls}>Roaster</label>
        <input name="roaster" type="text" required defaultValue={bean?.roaster ?? ''} className={inputCls} placeholder="e.g. Square Mile" />
      </div>
      <div>
        <label className={labelCls}>Origin <span className="text-text-dim normal-case">(optional)</span></label>
        <input name="origin" type="text" defaultValue={bean?.origin ?? ''} className={inputCls} placeholder="e.g. Ethiopia" />
      </div>
      <div>
        <label className={labelCls}>Roast level <span className="text-text-dim normal-case">(optional)</span></label>
        <select name="roast_level" defaultValue={bean?.roast_level ?? ''} className={inputCls}>
          <option value="">Select…</option>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-bloom text-base font-semibold py-2.5 rounded-xl text-sm hover:bg-bloom-hover transition-colors disabled:opacity-50"
      >
        {pending ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save changes' : 'Add bean')}
      </button>
    </form>
  )
}
