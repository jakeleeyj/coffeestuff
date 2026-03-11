'use client'

type Bean = { id: string; name: string; roast_level: string | null }

type Props = {
  beans: Bean[]
  selected: string[]
  onChange: (ids: string[]) => void
}

export default function BeanTagSelector({ beans, selected, onChange }: Props) {
  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter(s => s !== id)
        : [...selected, id]
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {beans.map(bean => {
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
    </div>
  )
}
