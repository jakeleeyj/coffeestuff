'use client'

import { useState } from 'react'

type Bean = { id: string; name: string; roast_level: string | null }

type Props = {
  beans: Bean[]
  selected: string[]
  onChange: (ids: string[]) => void
}

export default function BeanTagSelector({ beans, selected, onChange }: Props) {
  const [search, setSearch] = useState('')

  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter(s => s !== id)
        : [...selected, id]
    )
  }

  const filtered = search
    ? beans.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    : beans

  return (
    <div className="space-y-2">
      {beans.length > 5 && (
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search beans…"
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-text placeholder-text-dim focus:outline-none focus:border-bloom/60 transition-all"
        />
      )}
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-none">
        {filtered.map(bean => {
          const isSelected = selected.includes(bean.id)
          return (
            <button
              key={bean.id}
              type="button"
              onClick={() => toggle(bean.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                isSelected
                  ? 'bg-bloom text-base border-bloom'
                  : 'bg-surface-raised text-text-muted border-border hover:border-bloom-dim'
              }`}
            >
              {bean.name}
            </button>
          )
        })}
        {search && filtered.length === 0 && (
          <p className="text-xs text-text-dim py-1">No beans match &ldquo;{search}&rdquo;</p>
        )}
      </div>
    </div>
  )
}
