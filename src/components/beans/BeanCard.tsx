import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { deleteBean } from '@/lib/actions/beans'

type Bean = {
  id: string
  name: string
  roaster: string | null
  origin: string | null
  roast_level: string | null
  added_by: string | null
}

export default function BeanCard({ bean, userId }: { bean: Bean; userId?: string }) {
  const isOwner = !!userId && userId === bean.added_by
  const deleteBeanById = deleteBean.bind(null, bean.id)

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-bloom-dim transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-text truncate">{bean.name}</p>
          {bean.roaster && <p className="text-sm text-text-muted mt-0.5">{bean.roaster}</p>}
        </div>
        {bean.roast_level && <Badge label={bean.roast_level} />}
      </div>

      {bean.origin && (
        <p className="text-xs text-text-dim flex items-center gap-1">
          <span>📍</span> {bean.origin}
        </p>
      )}

      {isOwner && (
        <div className="flex items-center gap-3 pt-1 border-t border-border-subtle">
          <Link
            href={`/beans/${bean.id}/edit`}
            className="text-xs text-text-muted hover:text-bloom transition-colors"
          >
            Edit
          </Link>
          <form action={deleteBeanById}>
            <button type="submit" className="text-xs text-text-muted hover:text-red-400 transition-colors">
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
