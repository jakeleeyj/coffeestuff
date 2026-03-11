import Badge from '@/components/ui/Badge'

type Bean = {
  id: string
  name: string
  roaster: string
  origin: string | null
  roast_level: string | null
}

export default function BeanCard({ bean }: { bean: Bean }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-bloom-dim transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-text truncate">{bean.name}</p>
          <p className="text-sm text-text-muted mt-0.5">{bean.roaster}</p>
        </div>
        {bean.roast_level && <Badge label={bean.roast_level} />}
      </div>
      {bean.origin && (
        <p className="text-xs text-text-dim flex items-center gap-1">
          <span>📍</span> {bean.origin}
        </p>
      )}
    </div>
  )
}
